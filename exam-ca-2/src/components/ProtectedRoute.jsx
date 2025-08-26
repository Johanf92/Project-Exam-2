import { Navigate, Outlet } from "react-router-dom";
import { isAuthed } from "../lib/session.js";

export default function ProtectedRoute() {
  return isAuthed() ? <Outlet /> : <Navigate to="/login" replace />;
}
