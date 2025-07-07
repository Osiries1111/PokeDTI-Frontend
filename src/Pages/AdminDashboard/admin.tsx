import React, { useState, useEffect } from "react";
import "./admin.css";

import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../auth/useRequireAuth";
import { apiUrl } from "../../config/consts";
import axios from "axios";

const Admin: React.FC = () => {
  const navigate = useNavigate();

  const { token } = useRequireAuth(true);

  const [userAmount, setUserAmount] = useState(0);
  const [reportAmount, setReportAmount] = useState(0);
  const [gameAmount, setGameAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  // Count data

  useEffect(() => {
    setLoading(true);
    Promise.allSettled([
      axios
        .get(`${apiUrl}/users/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setUserAmount(response.data.count)),

      axios
        .get(`${apiUrl}/userinlobby/reports`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setReportAmount(response.data.length)),

      axios
        .get(`${apiUrl}/lobbies/count`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((response) => setGameAmount(response.data.count)),
    ]).finally(() => setLoading(false));
  }, [token]);

  const handleUsers = () => {
    console.log("admin all users");
    navigate(`/admin/users`);
  };

  const handleReports = () => {
    console.log("admin all reports pendientes");
    navigate(`/admin/reports`);
  };

  const handleGames = () => {
    console.log("admin all games active");
    navigate(`/admin/games`);
  };

  if (!token) {
    return null;
  }

  return (
    <div className="accordions-admin">
      <div className="bienvenida-admin">
        <h1>Bienvenido Super Administrador PokeDTI</h1>
      </div>
      <div className="container-redirect-admin">
        <div className="resumen-admin">
          <button onClick={handleUsers} className="button-admin">
            Users
          </button>
          <h1 className="details-number">{userAmount}</h1>
        </div>
        <div className="resumen-admin">
          <button onClick={handleReports} className="button-admin">
            Reports
          </button>
          <h1 className="details-number">{reportAmount}</h1>
        </div>
        <div className="resumen-admin">
          <button onClick={handleGames} className="button-admin">
            Games
          </button>
          <h1 className="details-number">{gameAmount}</h1>
        </div>
        {loading && (
          <div className="loading-message">
            <p>Loading data...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
