
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { LoginForm } from "./components/auth/LoginForm";
import { CreatePlan } from "./pages/CreatePlan";
import { EditPlan } from "./pages/EditPlan";
import { CreateClient } from "./pages/CreateClient";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

const BrokerRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, isBroker } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!isBroker) {
    return <Navigate to="/" />;
  }

  return <>{children}</>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginForm />} />
            <Route
              path="/"
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
              path="/create-client"
              element={
                <BrokerRoute>
                  <CreateClient />
                </BrokerRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

