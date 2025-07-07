import React, { useState, useEffect } from "react";
import axios from "axios";
import "./loungecards.css";
import DetailsLounge from "./DetailsLounge/detailslounge.tsx";
import { defoutProfileImage } from "../../../assets/find-game-page/index.ts";
import { useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../../auth/useRequireAuth.ts";
import { apiUrl } from "../../../config/consts.ts";

type FetchedRoom = {
  id: string;
  hostId: string;
  name: string;
  maxPlayers: number;
  theme: string;
};

type FetchedRoomHost = {
  id: string;
  name: string;
  profileImage: string;
};

type FetchedRoomAmount = {
  id: string;
  userCount: number;
};

type FullRoom = {
  id: string;
  hostId: string;
  name: string;
  maxPlayers: number;
  theme: string;
  userCount: number;
  hostName: string;
  hostProfileImage: string;
};

interface LoungeCardsProps {
  refreshKey?: number; // Optional prop for refreshing the component
}

// Tarjeta de sala de juego (LoungeCards). Se muestran en ruta /game
const LoungeCards: React.FC<LoungeCardsProps> = ({ refreshKey }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(true); // solo para mostrar u ocultar
  const [rooms, setRooms] = React.useState<FullRoom[]>([]);
  const { token, currentUser } = useRequireAuth();

  const handleClose = () => {
    setShowDetails(false);
    console.log(showDetails);
  };

  const handleJoin = async (roomNumber: string) => {
    try {
      const joinResponse = await axios.post(
        `${apiUrl}/userinlobby/${currentUser?.id}`,
        {
          lobbyId: roomNumber,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Unido a la sala:", joinResponse.data);
      navigate(`/lobby/${roomNumber}`);
    } catch (error: unknown) {
      let backendMessage = "Error al unirse a la sala";
      if (axios.isAxiosError(error) && error.response?.data?.error) {
        backendMessage = error.response.data.error;
      }
      alert(backendMessage);
      console.error("Error al unirse a la sala:", error);
    }
  };
  useEffect(() => {

    if (!token || !currentUser) {
      return;
    }

    const fetchRooms = async () => {
      try {
        const response = await axios.get(`${apiUrl}/lobbies/active`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching lounges:", error);
      }
    };
    const fetchRoomHosts = async (fetchedRooms: FetchedRoom[]) => {
      try {
        const response = await axios.get(`${apiUrl}/users/public`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            ids: fetchedRooms.map((room) => room.hostId).join(","),
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching room hosts:", error);
      }
    };

    // Fetch the number of users in each room
    const fetchRoomAmount = async (fetchedRooms: FetchedRoom[]) => {
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

      const fetchedRoomHosts = await fetchRoomHosts(fetchedRooms);
      if (!fetchedRoomHosts) return;

      const fetchedRoomAmounts = await fetchRoomAmount(fetchedRooms);
      if (!fetchedRoomAmounts) return;

      // Combine the data into a single array of FullRoom objects
      const combinedRooms: FullRoom[] = fetchedRooms.map(
        (room: FetchedRoom) => {
          const host = fetchedRoomHosts.find(
            (h: FetchedRoomHost) => h.id === room.hostId
          );
          const userCount =
            fetchedRoomAmounts.find((r: FetchedRoomAmount) => r.id === room.id)
              ?.userCount ?? 0;

          return {
            ...room,
            userCount,
            hostName: host?.username || "Desconocido",
            hostProfileImage: host?.profileImgUrl || defoutProfileImage,
          };
        }
      );

      setRooms(combinedRooms);
    };
    fetchData();

    console.log(rooms);


  }, [token, currentUser, refreshKey]);

  return (
    <div className="container-cards-lounge">
      {rooms.length === 0 ? (
        <div className="no-rooms-message">
          <h2 style={{ textAlign: "center" }}>No hay salas disponibles</h2>
          <p>¡Crea una nueva sala o espera a que alguien más lo haga!</p>
        </div>
      ) : (
        rooms.map((room, index) => (
          <DetailsLounge
            key={index}
            nameUserGame={room.hostName || "Desconocido"}
            imageUserGame={room.hostProfileImage || defoutProfileImage}
            nameRoom={room.name}
            totalparticipants={room.maxPlayers}
            topic={room.theme}
            placesAval={room.maxPlayers - room.userCount}
            onClose={handleClose}
            onJoin={() => handleJoin(room.id)}
          />
        ))
      )}
    </div>
  );
};

export default LoungeCards;
