package com.finnova.backend.service;

import com.finnova.backend.dto.ExpenseRequest;
import com.finnova.backend.dto.ExpenseResponse;
import com.finnova.backend.dto.ReceiptScanResponse;
import com.finnova.backend.dto.SaveExpenseFromScanRequest;
import com.finnova.backend.entity.Expense;
import com.finnova.backend.entity.ReceiptScan;
import com.finnova.backend.entity.ScanStatus;
import com.finnova.backend.entity.User;
import com.finnova.backend.exception.ResourceNotFoundException;
import com.finnova.backend.repository.ReceiptScanRepository;
import com.finnova.backend.security.UserDetailsImpl;
import com.finnova.backend.service.ocr.OcrService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReceiptScanService {

    private final FileStorageService fileStorageService;
    private final OcrService ocrService;
    private final BillParserService billParserService;
    private final ReceiptScanRepository receiptScanRepository;
    private final ExpenseService expenseService;

    @Transactional
    public ReceiptScanResponse uploadAndScan(MultipartFile file) {
        Long userId = currentUserId();
        FileStorageService.StoredFile stored = fileStorageService.storeReceiptImage(userId, file);

        String rawText = ocrService.extractText(stored.file());
        BillParserService.ParsedBill parsed = billParserService.parse(rawText);

        ReceiptScan scan = new ReceiptScan();
        scan.setUser(currentUserRef());
        scan.setImagePath(stored.path());
        scan.setOriginalFilename(stored.originalFilename());
        scan.setOcrProvider(ocrService.providerName());
        scan.setRawText(rawText);
        scan.setMerchant(parsed.merchant());
        scan.setAmount(parsed.amount());
        scan.setGstAmount(parsed.gstAmount());
        scan.setBillDate(parsed.billDate());
        scan.setStatus(ScanStatus.PARSED);

        return toResponse(receiptScanRepository.save(scan));
    }

    @Transactional(readOnly = true)
    public ReceiptScanResponse getScan(Long id) {
        return toResponse(getOwnedScan(id));
    }

    @Transactional(readOnly = true)
    public List<ReceiptScanResponse> getAll() {
        return receiptScanRepository.findByUserIdOrderByCreatedAtDesc(currentUserId()).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public ExpenseResponse saveAsExpense(Long scanId, SaveExpenseFromScanRequest request) {
        ReceiptScan scan = getOwnedScan(scanId);
        if (scan.getExpense() != null) {
            throw new IllegalStateException("This receipt scan has already been saved as an expense");
        }

        BigDecimal amount = request.getAmount() != null ? request.getAmount() : scan.getAmount();
        if (amount == null) {
            throw new IllegalArgumentException(
                    "Amount could not be read from the receipt; please provide it manually");
        }
        LocalDate expenseDate = request.getExpenseDate() != null ? request.getExpenseDate()
                : scan.getBillDate() != null ? scan.getBillDate() : LocalDate.now();
        String description = request.getDescription() != null ? request.getDescription() : buildDescription(scan);

        ExpenseRequest expenseRequest = new ExpenseRequest();
        expenseRequest.setCategoryId(request.getCategoryId());
        expenseRequest.setAmount(amount);
        expenseRequest.setExpenseDate(expenseDate);
        expenseRequest.setDescription(description);

        ExpenseResponse expenseResponse = expenseService.addExpense(expenseRequest);

        Expense expenseRef = new Expense();
        expenseRef.setId(expenseResponse.getId());
        scan.setExpense(expenseRef);
        scan.setStatus(ScanStatus.SAVED);
        receiptScanRepository.save(scan);

        return expenseResponse;
    }

    private String buildDescription(ReceiptScan scan) {
        String merchant = scan.getMerchant() != null ? scan.getMerchant() : "Scanned receipt";
        if (scan.getGstAmount() != null) {
            return truncate(merchant + " (GST: " + scan.getGstAmount() + ")");
        }
        return truncate(merchant);
    }

    private String truncate(String value) {
        return value.length() > 255 ? value.substring(0, 255) : value;
    }

    private ReceiptScan getOwnedScan(Long id) {
        return receiptScanRepository.findByIdAndUserId(id, currentUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Receipt scan not found with id: " + id));
    }

    private Long currentUserId() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return principal.getId();
    }

    private User currentUserRef() {
        User user = new User();
        user.setId(currentUserId());
        return user;
    }

    private ReceiptScanResponse toResponse(ReceiptScan scan) {
        return new ReceiptScanResponse(
                scan.getId(),
                scan.getStatus().name(),
                scan.getOcrProvider(),
                scan.getMerchant(),
                scan.getAmount(),
                scan.getGstAmount(),
                scan.getBillDate(),
                scan.getRawText(),
                scan.getExpense() != null ? scan.getExpense().getId() : null,
                scan.getCreatedAt());
    }
}
