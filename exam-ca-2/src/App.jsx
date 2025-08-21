import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./Layout/Layout";

import Home from "./pages/Home";
import Venue from "./pages/Venue";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="venue/:id" element={<Venue />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="dashboard" element={<Dashboard />} />
          {/* 404 fallback */}
          <Route path="*" element={<div className="p-6">Not Found</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
