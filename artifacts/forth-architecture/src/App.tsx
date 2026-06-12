import { useEffect } from "react";
import { Switch, Route, useLocation, Router as WouterRouter } from 'wouter';
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider, useAdminAuth } from "@/lib/auth";

// Pages
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import PortfolioPage from "@/pages/PortfolioPage";
import ProjectDetailPage from "@/pages/ProjectDetailPage";
import GalleryPage from "@/pages/GalleryPage";
import TeamPage from "@/pages/TeamPage";
import ContactPage from "@/pages/ContactPage";
import AdminDashboard from "@/pages/AdminDashboard";
import AdminLoginPage from "@/pages/AdminLoginPage";
import NotFound from "@/pages/not-found";

const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");

function ScrollToTop() {
  const [location] = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [location]);
  return null;
}

function AdminRoute() {
  const { isAdmin, isLoading } = useAdminAuth();
  if (isLoading) return null;
  if (!isAdmin) return <AdminLoginPage />;
  return <AdminDashboard />;
}

function AppRoutes() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ScrollToTop />
        <Switch>
          <Route path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/services" component={ServicesPage} />
          <Route path="/portfolio" component={PortfolioPage} />
          <Route path="/portfolio/:id" component={ProjectDetailPage} />
          <Route path="/gallery" component={GalleryPage} />
          <Route path="/team" component={TeamPage} />
          <Route path="/contact" component={ContactPage} />
          <Route path="/admin/login" component={AdminLoginPage} />
          <Route path="/admin" component={AdminRoute} />
          <Route path="/admin/*" component={AdminRoute} />
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

function App() {
  return (
    <WouterRouter base={basePath}>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </WouterRouter>
  );
}

export default App;
