
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import AnonymousReport from "./pages/AnonymousReport";
import AllReports from "./pages/AllReports";
import ReportDetails from "./pages/ReportDetails";
import PovertyMap from "./pages/PovertyMap";
import Funding from "./pages/Funding";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/report-anonymously" element={<AnonymousReport />} />
            <Route path="/reports" element={<AllReports />} />
            <Route path="/reports/:id" element={<ReportDetails />} />
            <Route path="/poverty-map" element={<PovertyMap />} />
            <Route path="/funding" element={<Funding />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
