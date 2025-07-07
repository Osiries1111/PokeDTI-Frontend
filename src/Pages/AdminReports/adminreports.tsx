import React, {useState, useEffect} from "react";
import "./adminreports.css";
import { useNavigate } from "react-router-dom";
import CardReportAdmin from "../../Components/AdminComponents/CardReportAdmin/cardreportadmin";
import { useRequireAuth } from "../../auth/useRequireAuth";
import { apiUrl } from "../../config/consts";
import axios from "axios";

type Report = {
  id: number;
  reportingUserInLobbyId: number;
  reportedUserInLobbyId: number;
  reason: string;
  reportingUserInLobby: {
    dressImgUrl: string;
    User: {
      id: number;
      username: string;
    };
  }
  reportedUserInLobby: {
    dressImgUrl: string;
    User: {
      id: number;
      username: string;
    };
  }
}

const AdminReports: React.FC = () => {
  const navigate = useNavigate();
  const [reports, setReportsAdmin] = useState<Report[]>([]);
  const handleToAdmin = () => {
    console.log("devuelto a admin general page");
    navigate(`/admin`);
  };

  const { token } = useRequireAuth(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/userinlobby/reports`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setReportsAdmin(response.data);
      })
      .catch((error) => {
        console.error("Error fetching reports:", error);
      });
  }, [token]);

  if (!token) {
    return null;
  }

  return (
    <div className="container-admin">
      <div className="title-and-out-user-admin">
        <div className="title-users-admin">
          <h1>Reports</h1>
        </div>
        <div className="out-to-general-admin-page">
          <button onClick={handleToAdmin}>Salir</button>
        </div>
      </div>

      <div className="container-users-admin-general">
        {reports.map((report) => (
          <CardReportAdmin
            key={report.id}
            idReport={report.id}
            idUserReport={report.reportingUserInLobby.User.id}
            usernameReport={report.reportingUserInLobby.User.username}
            idUserReported={report.reportedUserInLobby.User.id}
            usernameReported={report.reportedUserInLobby.User.username}
            details={report.reason}
            dressImgUrl={report.reportedUserInLobby.dressImgUrl}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminReports;
