package com.finnova.backend.service;

import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Locale;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Extracts structured bill fields (merchant, total amount, GST, date) out of
 * raw OCR text using layout heuristics common to printed receipts/invoices.
 * The heuristics are best-effort - callers should let users review/edit the
 * parsed values before persisting them as an expense.
 */
@Service
public class BillParserService {

    private static final List<String> TOTAL_KEYWORDS = List.of(
            "grand total", "net payable", "amount payable", "total amount",
            "balance due", "total due", "net amount", "total");

    private static final String NUMBER_AFTER_KEYWORD_TEMPLATE =
            "\\b%s\\b\\s*[:\\-]?\\s*(?:Rs\\.?|INR|₹|\\$)?\\s*([\\d,]+(?:\\.\\d{1,2})?)";

    private static final Pattern GENERIC_AMOUNT = Pattern.compile(
            "(?:Rs\\.?|INR|₹|\\$)\\s*([\\d,]+\\.\\d{2})|\\b(\\d{1,3}(?:,\\d{2,3})*\\.\\d{2})\\b");

    private static final Pattern GST_LINE = Pattern.compile(
            "(CGST|SGST|IGST|GST|VAT)\\s*(?:@?\\s*\\d{1,2}(?:\\.\\d+)?\\s*%)?\\s*[:\\-]?\\s*"
                    + "(?:Rs\\.?|INR|₹|\\$)?\\s*([\\d,]+(?:\\.\\d{1,2})?)",
            Pattern.CASE_INSENSITIVE);

    private static final Pattern NUMERIC_DATE = Pattern.compile(
            "\\b(\\d{4})[\\/\\-.](\\d{1,2})[\\/\\-.](\\d{1,2})\\b|\\b(\\d{1,2})[\\/\\-.](\\d{1,2})[\\/\\-.](\\d{2,4})\\b");

    private static final Pattern TEXT_MONTH_DATE = Pattern.compile(
            "\\b(\\d{1,2})\\s+([A-Za-z]{3,9})\\s+(\\d{2,4})\\b|\\b([A-Za-z]{3,9})\\s+(\\d{1,2}),?\\s+(\\d{2,4})\\b");

    private static final List<String> NON_MERCHANT_WORDS = List.of(
            "receipt", "invoice", "tax invoice", "cash memo", "bill", "original", "customer copy", "duplicate");

    public ParsedBill parse(String rawText) {
        if (rawText == null || rawText.isBlank()) {
            return new ParsedBill(null, null, null, null);
        }
        String text = rawText.replace("\r", "");
        List<String> lines = text.lines().map(String::trim).filter(l -> !l.isEmpty()).toList();

        return new ParsedBill(
                extractMerchant(lines),
                extractTotal(text),
                extractGst(text),
                extractDate(text));
    }

    private String extractMerchant(List<String> lines) {
        for (String line : lines.stream().limit(6).toList()) {
            String lower = line.toLowerCase(Locale.ROOT);
            boolean isNoise = NON_MERCHANT_WORDS.stream().anyMatch(lower::contains)
                    || line.chars().noneMatch(Character::isLetter)
                    || line.length() < 3;
            if (!isNoise) {
                return line;
            }
        }
        return lines.isEmpty() ? null : lines.get(0);
    }

    private BigDecimal extractTotal(String text) {
        for (String keyword : TOTAL_KEYWORDS) {
            Pattern pattern = Pattern.compile(String.format(NUMBER_AFTER_KEYWORD_TEMPLATE, Pattern.quote(keyword)),
                    Pattern.CASE_INSENSITIVE);
            Matcher matcher = pattern.matcher(text);
            if (matcher.find()) {
                BigDecimal value = toAmount(matcher.group(1));
                if (value != null) {
                    return value;
                }
            }
        }

        // Fallback: largest currency-looking amount anywhere in the text.
        Matcher matcher = GENERIC_AMOUNT.matcher(text);
        BigDecimal max = null;
        while (matcher.find()) {
            String raw = matcher.group(1) != null ? matcher.group(1) : matcher.group(2);
            BigDecimal value = toAmount(raw);
            if (value != null && (max == null || value.compareTo(max) > 0)) {
                max = value;
            }
        }
        return max;
    }

    private BigDecimal extractGst(String text) {
        Matcher matcher = GST_LINE.matcher(text);
        BigDecimal plainGst = null;
        BigDecimal splitGst = BigDecimal.ZERO;
        boolean foundSplit = false;

        while (matcher.find()) {
            String label = matcher.group(1).toUpperCase(Locale.ROOT);
            BigDecimal value = toAmount(matcher.group(2));
            if (value == null) {
                continue;
            }
            if (label.equals("GST") || label.equals("VAT")) {
                plainGst = value;
            } else {
                splitGst = splitGst.add(value);
                foundSplit = true;
            }
        }

        if (plainGst != null) {
            return plainGst;
        }
        return foundSplit ? splitGst : null;
    }

    private LocalDate extractDate(String text) {
        Matcher numeric = NUMERIC_DATE.matcher(text);
        if (numeric.find()) {
            LocalDate parsed = parseNumericDate(numeric);
            if (parsed != null) {
                return parsed;
            }
        }

        Matcher textual = TEXT_MONTH_DATE.matcher(text);
        if (textual.find()) {
            LocalDate parsed = parseTextualDate(textual);
            if (parsed != null) {
                return parsed;
            }
        }
        return null;
    }

    private LocalDate parseNumericDate(Matcher matcher) {
        try {
            if (matcher.group(1) != null) {
                // yyyy-MM-dd
                return LocalDate.of(Integer.parseInt(matcher.group(1)),
                        Integer.parseInt(matcher.group(2)), Integer.parseInt(matcher.group(3)));
            }
            // dd-MM-yyyy (common receipt format)
            int day = Integer.parseInt(matcher.group(4));
            int month = Integer.parseInt(matcher.group(5));
            int year = Integer.parseInt(matcher.group(6));
            if (year < 100) {
                year += 2000;
            }
            if (month > 12 && day <= 12) {
                int tmp = day;
                day = month;
                month = tmp;
            }
            return LocalDate.of(year, month, day);
        } catch (RuntimeException e) {
            return null;
        }
    }

    private LocalDate parseTextualDate(Matcher matcher) {
        String candidate = matcher.group(0);
        List<DateTimeFormatter> formatters = List.of(
                DateTimeFormatter.ofPattern("d MMM yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("d MMMM yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("MMM d, yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("MMMM d, yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("MMM d yyyy", Locale.ENGLISH),
                DateTimeFormatter.ofPattern("MMMM d yyyy", Locale.ENGLISH));
        for (DateTimeFormatter formatter : formatters) {
            try {
                return LocalDate.parse(candidate.replace(",", ""), formatter);
            } catch (DateTimeParseException ignored) {
                // try next pattern
            }
        }
        return null;
    }

    private BigDecimal toAmount(String raw) {
        if (raw == null) {
            return null;
        }
        try {
            return new BigDecimal(raw.replace(",", ""));
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public record ParsedBill(String merchant, BigDecimal amount, BigDecimal gstAmount, LocalDate billDate) {
    }
}
