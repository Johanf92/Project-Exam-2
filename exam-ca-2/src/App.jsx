import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";

import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateVenue from "./pages/CreateVenue.jsx";
import EditVenue from "./pages/EditVenue.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          {/* Private */}
          <Route element={<ProtectedRoute />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="venues/new" element={<CreateVenue />} />
            <Route path="venues/:id/edit" element={<EditVenue />} />
          </Route>
          {/* 404 fallback */}
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
