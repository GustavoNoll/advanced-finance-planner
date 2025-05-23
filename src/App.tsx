import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";
import { ClientLoginForm } from "./components/auth/ClientLoginForm";
import { CreatePlan } from "./pages/CreatePlan";
import { EditPlan } from "./pages/EditPlan";
import { BrokerDashboard } from "./pages/BrokerDashboard";
import { CreateClient } from "./pages/CreateClient";
import { InvestmentPlanShow } from "./pages/InvestmentPlan";
import FinancialRecords from "@/pages/FinancialRecords";
import ClientProfile from "@/pages/ClientProfile";
import EditFinancialRecord from "@/pages/EditFinancialRecord";
import FinancialGoals from "@/pages/FinancialGoals";
import Events from "@/pages/Events";
import { LoadingScreen } from "@/components/ui/loading-screen";
import { SpeedInsights } from "@vercel/speed-insights/react"
import { Analytics } from "@vercel/analytics/react"
import { AdminDashboard } from './pages/AdminDashboard';
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route path="/client-login/:clientId" element={<ClientLoginForm />} />
            <Route
              path="/admin-dashboard"
              element={
                <ProtectedRoute>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/broker-dashboard"
              element={
                <ProtectedRoute>
                  <BrokerDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-client"
              element={
                <ProtectedRoute>
                  <CreateClient />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client/:id"
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-plan"
              element={
                <ProtectedRoute>
                  <CreatePlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-plan/:id"
              element={
                <ProtectedRoute>
                  <EditPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/investment-plan/:id"
              element={
                <ProtectedRoute>
                  <InvestmentPlanShow />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-records"
              element={
                <ProtectedRoute>
                  <FinancialRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-records/:id"
              element={
                <ProtectedRoute>
                  <FinancialRecords />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-records/edit/:id"
              element={
                <ProtectedRoute>
                  <EditFinancialRecord />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-profile"
              element={
                <ProtectedRoute>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/client-profile/:id"
              element={
                <ProtectedRoute>
                  <ClientProfile />
                </ProtectedRoute>
              }
            />
            <Route
              path="/financial-goals/:id?"
              element={
                <ProtectedRoute>
                  <FinancialGoals />
                </ProtectedRoute>
              }
            />
            <Route
              path="/events/:id?"
              element={
                <ProtectedRoute>
                  <Events />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
        <Analytics />
        <SpeedInsights />
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
