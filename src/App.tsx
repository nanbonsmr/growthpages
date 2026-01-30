import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { ThemeProvider } from "next-themes";

// Public Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PricingPage from "./pages/PricingPage";
import PublicSignupPage from "./pages/PublicSignupPage";
import NotFound from "./pages/NotFound";

// Dashboard Pages
import Overview from "./pages/dashboard/Overview";
import Pages from "./pages/dashboard/Pages";
import CreatePage from "./pages/dashboard/CreatePage";
import EditPage from "./pages/dashboard/EditPage";
import Subscribers from "./pages/dashboard/Subscribers";
import ContactSubmissions from "./pages/dashboard/ContactSubmissions";
import Analytics from "./pages/dashboard/Analytics";
import Settings from "./pages/dashboard/Settings";

// Admin
import Admin from "./pages/Admin";

const queryClient = new QueryClient();

const App = () => (
  <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Landing />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/p/:slug" element={<PublicSignupPage />} />

              {/* Protected Dashboard Routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Overview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pages"
                element={
                  <ProtectedRoute>
                    <Pages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pages/new"
                element={
                  <ProtectedRoute>
                    <CreatePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/pages/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/subscribers"
                element={
                  <ProtectedRoute>
                    <Subscribers />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/contacts"
                element={
                  <ProtectedRoute>
                    <ContactSubmissions />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/analytics"
                element={
                  <ProtectedRoute>
                    <Analytics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />

              {/* Admin Route */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute>
                    <Admin />
                  </ProtectedRoute>
                }
              />

              {/* Catch-all */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </ThemeProvider>
);

export default App;
