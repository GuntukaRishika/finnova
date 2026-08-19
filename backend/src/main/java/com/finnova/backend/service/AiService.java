package com.finnova.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.finnova.backend.dto.AiInsight;
import com.finnova.backend.dto.AiChatResponse;
import com.finnova.backend.dto.AiRecommendation;
import com.finnova.backend.dto.AdvisorDecisionResponse;
import com.finnova.backend.dto.AdvisorHistoryItem;
import com.finnova.backend.dto.FinancialAnalysisResponse;
import com.finnova.backend.entity.Budget;
import com.finnova.backend.entity.AdvisorQuestion;
import com.finnova.backend.exception.AiProcessingException;
import com.finnova.backend.repository.BudgetRepository;
import com.finnova.backend.repository.AdvisorQuestionRepository;
import com.finnova.backend.repository.ExpenseRepository;
import com.finnova.backend.repository.IncomeRepository;
import com.finnova.backend.repository.UserRepository;
import com.finnova.backend.security.UserDetailsImpl;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.YearMonth;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AiService {

    private static final String CHAT_SYSTEM_PROMPT = """
            You are Finnova's AI financial assistant. Help the user understand and improve their personal finances \
            using ONLY the financial summary below - never invent figures that aren't there. Keep replies short \
            (2-4 sentences), practical, and friendly. If the summary lacks the data needed to answer, say so and \
            suggest what the user could log instead.

            User's financial summary:
            %s
            """;

    private static final String ANALYZE_PROMPT = """
            You are a financial analytics engine for the Finnova app. Using ONLY the financial summary below, \
            produce 3 to 5 concise spending insights about the user's current month. Base every figure strictly on \
            the data given - never fabricate numbers.

            Financial summary:
            %s

            Respond with ONLY a JSON array (no markdown, no commentary) shaped exactly like:
            [{"title": "short title, max 6 words", "value": "headline figure or percentage as a short string", "description": "one sentence of explanation or a suggestion"}]
            """;

    private static final String ADVICE_PROMPT = """
            You are a financial advisor for the Finnova app. Below is the user's financial summary and a list of \
            findings already flagged by the app's rule-based decision engine (budget, savings, and goal analysis). \
            Rewrite those findings into warm, actionable recommendations a user would want to read. Do not invent \
            new findings, numbers, or categories that are not present below - only rephrase and prioritize what's \
            given. If the findings list is empty, write one encouraging recommendation acknowledging there are no \
            issues right now.

            Financial summary:
            %s

            Flagged findings (JSON):
            %s

            Respond with ONLY a JSON array (no markdown, no commentary) shaped exactly like:
            [{"title": "short recommendation title, max 6 words", "summary": "one to two sentences explaining the recommendation and why it matters", "priority": "HIGH, MEDIUM, or LOW", "category": "BUDGET, SAVINGS, GOAL, or GENERAL"}]
            """;

    private final ExpenseRepository expenseRepository;
    private final IncomeRepository incomeRepository;
    private final BudgetRepository budgetRepository;
    private final AdvisorQuestionRepository advisorQuestionRepository;
    private final UserRepository userRepository;
    private final GeminiClient geminiClient;
    private final RecommendationEngine recommendationEngine;
    private final ObjectMapper objectMapper;

    @Transactional
    public String chat(String message) {
        String context = buildFinancialContext();
        String answer = geminiClient.generateText(CHAT_SYSTEM_PROMPT.formatted(context), message);
        AdvisorQuestion question = new AdvisorQuestion();
        question.setUser(currentUser());
        question.setQuestion(message);
        question.setAnswer(answer);
        advisorQuestionRepository.save(question);
        return answer;
    }

    @Transactional
    public AiChatResponse chatResponse(String message) {
        String answer = chat(message);
        AdvisorDecisionResponse decision = evaluateDecision(message);
        return new AiChatResponse(answer, decision.getDecision(), decision.getReason());
    }

    @Transactional(readOnly = true)
    public List<AdvisorHistoryItem> getChatHistory() {
        return advisorQuestionRepository.findByUserIdOrderByCreatedAtAsc(currentUserId()).stream()
                .map(item -> new AdvisorHistoryItem(item.getId(), item.getQuestion(), item.getAnswer(), item.getCreatedAt()))
                .toList();
    }

    @Transactional
    public void clearChatHistory() {
        advisorQuestionRepository.deleteByUserId(currentUserId());
    }

    @Transactional(readOnly = true)
    public AdvisorDecisionResponse evaluateDecision(String question) {
        String normalized = question.toLowerCase();
        boolean purchaseQuestion = normalized.contains("buy") || normalized.contains("purchase")
                || normalized.contains("afford") || normalized.contains("spend");
        if (!purchaseQuestion) {
            return new AdvisorDecisionResponse("NONE", "Ask whether you should buy or wait for a purchase decision.");
        }

        List<AiRecommendation> recommendations = recommendationEngine.generateRecommendations();
        boolean urgentIssue = recommendations.stream().anyMatch(item -> "HIGH".equals(item.getPriority()));
        if (urgentIssue) {
            return new AdvisorDecisionResponse("WAIT", "Your current budget, savings, or goal warnings suggest postponing non-essential spending.");
        }
        return new AdvisorDecisionResponse("BUY_NOW", "No high-priority budget, savings, or goal warning is currently active. Confirm the purchase still fits your available cash.");
    }

    @Transactional(readOnly = true)
    public List<AiInsight> analyzeExpenses() {
        String context = buildFinancialContext();
        JsonNode array = readJsonArray(geminiClient.generateJson(null, ANALYZE_PROMPT.formatted(context)));

        List<AiInsight> insights = new ArrayList<>();
        for (JsonNode node : array) {
            insights.add(new AiInsight(
                    node.path("title").asText(""),
                    node.path("value").asText(""),
                    node.path("description").asText("")));
        }
        return insights;
    }

    /**
     * Recommendations come from {@link RecommendationEngine}'s rule-based decision logic first
     * (budget, savings, and goal analysis) - that part always works, even without Gemini. When
     * Gemini is configured, its output is used to rephrase those same findings into friendlier
     * copy; on any failure (missing key, network error, bad JSON) we silently fall back to the
     * rule-based list instead of failing the request.
     */
    @Transactional(readOnly = true)
    public List<AiRecommendation> getAdvice() {
        List<AiRecommendation> ruleBased = recommendationEngine.generateRecommendations();
        if (ruleBased.isEmpty()) {
            ruleBased = List.of(new AiRecommendation(
                    "You're on track",
                    "No budget, savings, or goal issues detected this month. Keep up the good habits!",
                    "LOW", "GENERAL"));
        }

        try {
            String context = buildFinancialContext();
            String findingsJson = objectMapper.writeValueAsString(ruleBased);
            String prompt = ADVICE_PROMPT.formatted(context, findingsJson);
            JsonNode array = readJsonArray(geminiClient.generateJson(null, prompt));

            List<AiRecommendation> polished = new ArrayList<>();
            for (JsonNode node : array) {
                polished.add(new AiRecommendation(
                        node.path("title").asText(""),
                        node.path("summary").asText(""),
                        node.path("priority").asText("MEDIUM"),
                        node.path("category").asText("GENERAL")));
            }
            return polished.isEmpty() ? ruleBased : polished;
        } catch (Exception ex) {
            return ruleBased;
        }
    }

    /** Raw budget/savings/goal analysis, with no AI text generation involved. */
    @Transactional(readOnly = true)
    public FinancialAnalysisResponse getFinancialAnalysis() {
        return new FinancialAnalysisResponse(
                recommendationEngine.analyzeBudgets(),
                recommendationEngine.analyzeSavings(),
                recommendationEngine.analyzeGoals());
    }

    private JsonNode readJsonArray(String json) {
        try {
            JsonNode node = objectMapper.readTree(json);
            if (!node.isArray()) {
                throw new AiProcessingException("Gemini did not return the expected JSON array.");
            }
            return node;
        } catch (AiProcessingException ex) {
            throw ex;
        } catch (Exception ex) {
            throw new AiProcessingException("Failed to parse Gemini's response as JSON.", ex);
        }
    }

    private String buildFinancialContext() {
        Long userId = currentUserId();
        YearMonth current = YearMonth.now();
        YearMonth previous = current.minusMonths(1);

        BigDecimal income = sumIncome(userId, current);
        BigDecimal expense = sumExpense(userId, current);
        BigDecimal previousExpense = sumExpense(userId, previous);
        BigDecimal net = income.subtract(expense);

        List<Object[]> categoryRows = expenseRepository.sumAmountGroupByCategory(
                userId, current.atDay(1), current.atEndOfMonth());
        categoryRows.sort((a, b) -> ((BigDecimal) b[2]).compareTo((BigDecimal) a[2]));

        List<Budget> budgets = budgetRepository.findByUserIdAndYearAndMonth(
                userId, current.getYear(), current.getMonthValue());

        StringBuilder sb = new StringBuilder();
        sb.append("Month: ").append(current).append('\n');
        sb.append("Total income: ").append(income).append('\n');
        sb.append("Total expenses: ").append(expense).append('\n');
        sb.append("Net savings: ").append(net).append('\n');
        sb.append("Previous month expenses: ").append(previousExpense).append('\n');

        sb.append("Spending by category this month:\n");
        if (categoryRows.isEmpty()) {
            sb.append("- No expenses logged this month.\n");
        } else {
            for (Object[] row : categoryRows) {
                String name = (String) row[1];
                BigDecimal amount = (BigDecimal) row[2];
                BigDecimal percent = percentOf(amount, expense);
                sb.append("- ").append(name).append(": ").append(amount).append(" (").append(percent).append("%)\n");
            }
        }

        sb.append("Budgets this month:\n");
        if (budgets.isEmpty()) {
            sb.append("- No budgets set.\n");
        } else {
            for (Budget budget : budgets) {
                BigDecimal spent = expenseRepository.sumAmountByUserIdAndCategoryIdAndExpenseDateBetween(
                        userId, budget.getCategory().getId(), current.atDay(1), current.atEndOfMonth());
                BigDecimal budgetAmount = budget.getAmount();
                BigDecimal usedPercent = percentOf(spent, budgetAmount);
                sb.append("- ").append(budget.getCategory().getName()).append(": budget ")
                        .append(budgetAmount).append(", spent ").append(spent)
                        .append(" (").append(usedPercent).append("% used)\n");
            }
        }

        return sb.toString();
    }

    private BigDecimal percentOf(BigDecimal part, BigDecimal whole) {
        if (whole == null || whole.compareTo(BigDecimal.ZERO) == 0) {
            return BigDecimal.ZERO;
        }
        return part.divide(whole, 4, RoundingMode.HALF_UP)
                .multiply(BigDecimal.valueOf(100))
                .setScale(1, RoundingMode.HALF_UP);
    }

    private BigDecimal sumIncome(Long userId, YearMonth yearMonth) {
        return incomeRepository.sumAmountByUserIdAndIncomeDateBetween(userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private BigDecimal sumExpense(Long userId, YearMonth yearMonth) {
        return expenseRepository.sumAmountByUserIdAndExpenseDateBetween(userId, yearMonth.atDay(1), yearMonth.atEndOfMonth());
    }

    private Long currentUserId() {
        return currentUser().getId();
    }

    private com.finnova.backend.entity.User currentUser() {
        UserDetailsImpl principal = (UserDetailsImpl) SecurityContextHolder.getContext()
                .getAuthentication().getPrincipal();
        return userRepository.findById(principal.getId())
            .orElseThrow(() -> new IllegalStateException("Authenticated user no longer exists"));
    }
}
