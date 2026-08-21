import "@/App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/lib/auth";
import CustomerLayout from "@/components/CustomerLayout";
import PriestLayout from "@/components/PriestLayout";
import AdminLayout from "@/components/AdminLayout";
import SpiritualInteractions from "@/components/SpiritualInteractions";

import Landing from "@/pages/Landing";
import KannadaPurohitLanding from "@/pages/KannadaPurohitLanding";
import Login from "@/pages/Login";
import AdminLogin from "@/pages/AdminLogin";

import CustomerHome from "@/pages/customer/Home";
import PriestList from "@/pages/customer/PriestList";
import PriestDetail from "@/pages/customer/PriestDetail";
import Booking from "@/pages/customer/Booking";
import MyBookings from "@/pages/customer/MyBookings";
import AIAssistant from "@/pages/customer/AIAssistant";
import Profile from "@/pages/customer/Profile";

import PriestDashboard from "@/pages/priest/Dashboard";
import PriestOnboarding from "@/pages/priest/Onboarding";
import PriestBookings from "@/pages/priest/PriestBookings";
import Availability from "@/pages/priest/Availability";
import PriestProfile from "@/pages/priest/PriestProfile";

import AdminDashboard from "@/pages/admin/AdminDashboard";
import SuperAdminDashboard from "@/pages/admin/SuperAdminDashboard";
import AdminPriests from "@/pages/admin/AdminPriests";
import AdminBookings from "@/pages/admin/AdminBookings";
import AdminPoojas from "@/pages/admin/AdminPoojas";
import AdminDisputes from "@/pages/admin/AdminDisputes";

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/kn/purohit" element={<KannadaPurohitLanding />} />
            <Route path="/kn" element={<KannadaPurohitLanding />} />
            <Route path="/login" element={<Login />} />
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Customer app */}
            <Route path="/app" element={<CustomerLayout />}>
              <Route index element={<CustomerHome />} />
              <Route path="priests" element={<PriestList />} />
              <Route path="priests/:priestId" element={<PriestDetail />} />
              <Route path="book/:priestId" element={<Booking />} />
              <Route path="bookings" element={<MyBookings />} />
              <Route path="ai" element={<AIAssistant />} />
              <Route path="profile" element={<Profile />} />
            </Route>

            {/* Priest portal */}
            <Route path="/priest/onboarding" element={<PriestOnboarding />} />
            <Route path="/priest" element={<PriestLayout />}>
              <Route index element={<PriestDashboard />} />
              <Route path="bookings" element={<PriestBookings />} />
              <Route path="availability" element={<Availability />} />
              <Route path="profile" element={<PriestProfile />} />
            </Route>

            {/* Admin portal */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="super" element={<SuperAdminDashboard />} />
              <Route path="priests" element={<AdminPriests />} />
              <Route path="bookings" element={<AdminBookings />} />
              <Route path="poojas" element={<AdminPoojas />} />
              <Route path="disputes" element={<AdminDisputes />} />
            </Route>
          </Routes>
        </BrowserRouter>
        <Toaster position="top-center" richColors />
        <SpiritualInteractions />
      </AuthProvider>
    </div>
  );
}

export default App;
