import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Tournaments from "./pages/Tournaments";
import TournamentDetail from "./pages/TournamentDetail";
import CreateTournament from "./pages/CreateTournament";
import EditTournament from "./pages/EditTournament";
import Auth from "./pages/Auth";
import Register from "./pages/Register";
import RegisterUmpire from "./pages/RegisterUmpire";
import RegisterGroundOwner from "./pages/RegisterGroundOwner";
import BecomeOrganizer from "./pages/BecomeOrganizer";
import LiveAuctions from "./pages/LiveAuctions";
import LiveAuction from "./pages/LiveAuction";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/tournaments" element={<Tournaments />} />
            <Route path="/tournaments/:id" element={<TournamentDetail />} />
            <Route path="/tournaments/:id/edit" element={<EditTournament />} />
            <Route path="/tournaments/new" element={<CreateTournament />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/register" element={<Register />} />
            <Route path="/register-umpire" element={<RegisterUmpire />} />
            <Route path="/register-ground-owner" element={<RegisterGroundOwner />} />
            <Route path="/become-organizer" element={<BecomeOrganizer />} />
            <Route path="/auctions" element={<LiveAuctions />} />
            <Route path="/auctions/:id" element={<LiveAuction />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
