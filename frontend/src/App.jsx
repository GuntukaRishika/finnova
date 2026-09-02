import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import LandingPage from './pages/LandingPage'
import FeaturesPage from './pages/FeaturesPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ForgotPasswordPage from './pages/ForgotPasswordPage'
import DashboardPage from './pages/DashboardPage'
import IncomePage from './pages/IncomePage'
import ExpensePage from './pages/ExpensePage'
import BudgetPage from './pages/BudgetPage'
import BillReminderPage from './pages/BillReminderPage'
import InvestmentPage from './pages/InvestmentPage'
import AnalyticsPage from './pages/AnalyticsPage'
import GoalsPage from './pages/GoalsPage'
import ScanBillPage from './pages/ScanBillPage'
import AIAnalysisPage from './pages/AIAnalysisPage'
import AIFinancialAdvisorPage from './pages/AIFinancialAdvisorPage'
import NotFoundPage from './pages/NotFoundPage'

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/features" element={<FeaturesPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/income"
          element={
            <ProtectedRoute>
              <IncomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/expense"
          element={
            <ProtectedRoute>
              <ExpensePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/budget"
          element={
            <ProtectedRoute>
              <BudgetPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reminders"
          element={
            <ProtectedRoute>
              <BillReminderPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/investments"
          element={
            <ProtectedRoute>
              <InvestmentPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <AnalyticsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-analysis"
          element={
            <ProtectedRoute>
              <AIAnalysisPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/ai-advisor"
          element={
            <ProtectedRoute>
              <AIFinancialAdvisorPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <GoalsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/scan-bill"
          element={
            <ProtectedRoute>
              <ScanBillPage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Layout>
  )
}

export default App
