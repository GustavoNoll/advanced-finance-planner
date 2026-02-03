import { Toaster } from "@/shared/components/ui/toaster";
import { Toaster as Sonner } from "@/shared/components/ui/sonner";
import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "@/features/auth/components/AuthProvider";
import { ActivityTracker } from "@/shared/components/activity-tracker";
import Index from "./pages/Index";
import NotFound from "@/shared/components/NotFound";
import { LoginForm } from "@/features/auth/components/LoginForm";
import { ClientLoginForm } from "@/features/auth/components/ClientLoginForm";
import { EditPlan } from "@/features/investment-plans/pages/EditPlan";
import { CreateClient } from "@/features/client-management/pages/CreateClient";
import { InvestmentPlanShow } from "@/features/investment-plans/pages/InvestmentPlan";
import { Simulation } from "@/features/investment-plans/pages/Simulation";
import PortfolioDataManagement from "@/features/portfolio-performance/pages/PortfolioDataManagement";
import StatementImportsHistory from "@/features/portfolio-performance/pages/StatementImportsHistory";
import MarketDataAudit from "@/features/portfolio-performance/pages/MarketDataAudit";
import BulkPDFImport from "@/features/portfolio-performance/pages/BulkPDFImport";
import { ManagePdfImportInstitutions } from "@/features/admin/pages/ManagePdfImportInstitutions";
import FinancialRecords from "@/features/financial-records/pages/FinancialRecords";
import ClientProfile from "@/features/client-management/pages/ClientProfile";
import FinancialGoals from "@/features/goals-events/pages/FinancialGoals";
import Events from "@/features/goals-events/pages/Events";
import { LoadingScreen } from "@/shared/components/ui/loading-screen";
import { PageTransition } from "@/shared/components/ui/page-transition";
import { ScrollToTop } from "@/shared/components/ui/scroll-to-top";
import { RouteProgress } from "@/shared/components/ui/route-progress";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { Suspense, lazy } from 'react'
import { ThemeToggle } from '@/shared/components/ui/theme-toggle'
import { CurrencyProvider } from '@/contexts/CurrencyContext'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { LanguageSwitcher } from '@/shared/components/ui/language-switcher'
const AdminDashboard = lazy(() => import('@/features/admin/pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const BrokerDashboard = lazy(() => import('@/features/broker-dashboard/pages/BrokerDashboard').then(m => ({ default: m.BrokerDashboard })))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  // Only show loading screen on initial load, not during navigation
  // This prevents flickering when navigating after login
  if (loading && !user) {
    return <LoadingScreen />;
  }

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  // If we have a user but still loading (e.g., fetching profile), show children with minimal loading
  // This allows smooth transition from login
  return <>{children}</>;
};

function AppRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route 
          path="/" 
          element={
            <PageTransition>
              <Suspense fallback={<LoadingScreen />}>
                <LandingPage />
              </Suspense>
            </PageTransition>
          } 
        />
        <Route path="/login" element={<PageTransition><LoginForm /></PageTransition>} />
        <Route path="/client-login/:clientId" element={<PageTransition><ClientLoginForm /></PageTransition>} />
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Suspense fallback={<LoadingScreen />}> 
                  <AdminDashboard />
                </Suspense>
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Index />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/broker-dashboard"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Suspense fallback={<LoadingScreen />}> 
                  <BrokerDashboard />
                </Suspense>
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/simulation"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Simulation />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/create-client"
          element={
            <ProtectedRoute>
              <PageTransition>
                <CreateClient />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Index />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Index />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/edit-plan/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <EditPlan />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/investment-plan/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <InvestmentPlanShow />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/financial-records"
          element={
            <ProtectedRoute>
              <PageTransition>
                <FinancialRecords />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/portfolio-data-management/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <PortfolioDataManagement />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/market-data-audit"
          element={
            <ProtectedRoute>
              <PageTransition>
                <MarketDataAudit />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-pdf-institutions"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ManagePdfImportInstitutions />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/statement-imports-history/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <StatementImportsHistory />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/bulk-pdf-import"
          element={
            <ProtectedRoute>
              <PageTransition>
                <BulkPDFImport />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/financial-records/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <FinancialRecords />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-profile"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ClientProfile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/client-profile/:id"
          element={
            <ProtectedRoute>
              <PageTransition>
                <ClientProfile />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/financial-goals/:id?"
          element={
            <ProtectedRoute>
              <PageTransition>
                <FinancialGoals />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route
          path="/events/:id?"
          element={
            <ProtectedRoute>
              <PageTransition>
                <Events />
              </PageTransition>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  )
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <LanguageProvider>
          <CurrencyProvider>
            <ActivityTracker>
              <TooltipProvider>
              <RouteProgress />
              <ThemeToggle />
              <LanguageSwitcher />
                <Toaster />
                <Sonner />
                <ScrollToTop />
                <AppRoutes />
              </TooltipProvider>
            </ActivityTracker>
            <Analytics />
            <SpeedInsights />
          </CurrencyProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
