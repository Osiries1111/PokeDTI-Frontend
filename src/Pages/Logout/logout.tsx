import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../auth/useRequireAuth";

export default function LogoutPage() {
  const { logout } = useRequireAuth();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/", { replace: true });
  }, [logout, navigate]);

  return null;
}