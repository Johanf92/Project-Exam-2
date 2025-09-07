import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import LandingOnce from "./pages/LandingOnce.jsx";
import Home from "./pages/Home.jsx";
import Venue from "./pages/Venue.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreateVenue from "./pages/CreateVenue.jsx";
import EditVenue from "./pages/EditVenue.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter basename={import.meta.env.BASE_URL}>
      <Routes>
        <Route element={<Layout />}>
          {/* Landing shows only once */}
          <Route index element={<LandingOnce />} />

          {/* Venues list + details */}
          <Route path="venues" element={<Home />} />
          <Route path="venue/:id" element={<Venue />} />

          {/* Auth */}
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />

          {/* Protected */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="venues/new" element={<CreateVenue />} />
            <Route path="venues/:id/edit" element={<EditVenue />} />
          </Route>

          {/* 404 → home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
