import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import { ActivityTracker } from "./components/ActivityTracker";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";
import { ClientLoginForm } from "./components/auth/ClientLoginForm";
import { EditPlan } from "./pages/EditPlan";
import { CreateClient } from "./pages/CreateClient";
import { InvestmentPlanShow } from "./pages/InvestmentPlan";
import { Simulation } from "./pages/Simulation";
import FinancialRecords from "@/pages/FinancialRecords";
import ClientProfile from "@/pages/ClientProfile";
import FinancialGoals from "@/pages/FinancialGoals";
import Events from "@/pages/Events";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { PageTransition } from "@/components/ui/page-transition";
import { ScrollToTop } from "@/components/ui/scroll-to-top";
import { RouteProgress } from "@/components/ui/route-progress";
import { AnimatePresence } from "framer-motion";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { Suspense, lazy } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
const AdminDashboard = lazy(() => import('./pages/AdminDashboard').then(m => ({ default: m.AdminDashboard })))
const BrokerDashboard = lazy(() => import('./pages/BrokerDashboard').then(m => ({ default: m.BrokerDashboard })))
const LandingPage = lazy(() => import('./pages/LandingPage'))
const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

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
        <ActivityTracker>
          <TooltipProvider>
            <RouteProgress />
            <ThemeToggle />
            <Toaster />
            <Sonner />
            <ScrollToTop />
            <AppRoutes />
          </TooltipProvider>
        </ActivityTracker>
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
