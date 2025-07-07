import React, { useState, useEffect } from "react";
import "./admingames.css";
import { useNavigate } from "react-router-dom";
import CardGameAdmin from "../../Components/AdminComponents/CardGameAdmin/cardgameadmin";
import { useRequireAuth } from "../../auth/useRequireAuth";
import { apiUrl } from "../../config/consts";
import axios from "axios";

type Lobby = {
  id: number;
  name: string;
  status: string;
  maxPlayers: number;
  theme: string;
  userCount: number;
};

type FetchedLobby = {
  id: number;
  name: string;
  status: string;
  maxPlayers: number;
  theme: string;
};

type FetchedRoomAmount = {
  lobbyId: number;
  count: number;
};

const AdminGames: React.FC = () => {
  const navigate = useNavigate();

  const handleToAdmin = () => {
    console.log("devuelto a admin general page");
    navigate(`/admin`);
  };

  const { token } = useRequireAuth(true);

  const [lobbies, setLobbies] = useState<Lobby[]>([]);

  const [updateIndex, setUpdateIndex] = useState<number>(0);

  const triggerUpdate = () => {
    setUpdateIndex((prevIndex) => prevIndex + 1);
  };

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lobbies`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching lounges:", error);
      }
    };

    // Fetch the number of users in each room
    const fetchRoomAmount = async (fetchedRooms: FetchedLobby[]) => {
      try {
        const response = await axios.get(`${apiUrl}/lobbies/count-users`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: fetchedRooms.map((room) => room.id).join(","),
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching room amounts:", error);
      }
    };

    const fetchData = async () => {
      const fetchedRooms = await fetchRooms();
      if (!fetchedRooms || fetchedRooms.length == 0) return;
      const fetchedRoomAmounts = await fetchRoomAmount(fetchedRooms);
      if (!fetchedRoomAmounts) return;
      console.log("Fetched rooms:", fetchedRoomAmounts);
      // Combine the data into a single array of Lobby objects
      const combinedRooms: Lobby[] = fetchedRooms.map(
        (room: FetchedLobby) => {
          const userCountInLobby =
            fetchedRoomAmounts.find((r: FetchedRoomAmount) => r.lobbyId == room.id)
              ?.count;
          return {
            ...room,
            userCount: userCountInLobby || 0, // Default to 0 if not found
          };
        }
      );
      console.log("Lobbies fetched:", combinedRooms);
      setLobbies(combinedRooms);
    };
    fetchData();
  }, [updateIndex, token]);

  if (!token) {
    return null;
  }

  return (
    <div className="container-admin">
      <div className="title-and-out-user-admin">
        <div className="title-users-admin">
          <h1>Games Now</h1>
        </div>
        <div className="out-to-general-admin-page">
          <button onClick={handleToAdmin}>Salir</button>
        </div>
      </div>

      <div className="container-users-admin-general">
        {lobbies.map((game) => (
          <CardGameAdmin
            key={game.id}
            idGame={game.id}
            nameGame={game.name}
            statusGame={game.status}
            maxUsers={game.maxPlayers}
            userCount={game.userCount}
            updateGameList={triggerUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default AdminGames;
