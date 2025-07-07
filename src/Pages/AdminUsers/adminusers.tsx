import React, {useState, useEffect} from "react";
import "./adminusers.css";
import CardUserAdmin from "../../Components/AdminComponents/CardUserAdmin/carduseradmin";
import { defoutProfileImage } from "../../assets/find-game-page";
import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../auth/useRequireAuth";
import { apiUrl } from "../../config/consts";
import axios from "axios";


type User = {
    id: number;
    username: string;
    profileImgUrl: string;
    profileDescription: string;
    email: string;
};

const AdminUsers: React.FC = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);

  const handleToAdmin = () => {
    console.log("devuelto a admin general page");
    navigate(`/admin`);
  };

  const { token } = useRequireAuth(true);

  useEffect(() => {
    axios
      .get(`${apiUrl}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Users fetched successfully:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });

  }, [token]);  

  if (!token) {
    return null;
  }

  return (
    <div className="container-admin">
      <div className="title-and-out-user-admin">
        <div className="title-users-admin">
          <h1>Users</h1>
        </div>
        <div className="out-to-general-admin-page">
          <button onClick={handleToAdmin}>Salir</button>
        </div>
      </div>
      <div className="container-users-admin-general">
        {users.map((user: User) => (
          <CardUserAdmin
            key={user.id}
            idUser={user.id}
            username={user.username}
            profileImg={user.profileImgUrl || defoutProfileImage}
            details={user.profileDescription}
            email={user.email}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminUsers;
