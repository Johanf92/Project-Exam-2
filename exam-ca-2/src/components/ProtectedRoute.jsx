import { Navigate, Outlet } from "react-router-dom";
import { isAuthed } from "../lib/session.js";

/**
 * @file ProtectedRoute component — guards routes that require authentication.
 * If the user is not authenticated, redirects to the login page.
 */

/**
 * ProtectedRoute component.
 *
 * @component
 * @returns {JSX.Element} The nested route (`<Outlet />`) if authenticated,
 * otherwise a `<Navigate />` redirect to `/login`.
 */

export default function ProtectedRoute() {
  return isAuthed() ? <Outlet /> : <Navigate to="/login" replace />;
}
