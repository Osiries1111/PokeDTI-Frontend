import React from "react";
import { useNavigate } from "react-router-dom";
import { snorlaxSprite } from "../../../assets/others-sprites/index.ts";
import "./outbutton.css";
import axios from "axios";
import { apiUrl } from "../../../config/consts.ts";
import { useRequireAuth } from "../../../auth/useRequireAuth.ts";
import { Socket } from "socket.io-client";
interface Out {
  userInLobbyId: number;
  isRoomOwner: boolean;
  lobbyId: number;
  socket: Socket | null;
}

const OutButton: React.FC<Out> = ({ userInLobbyId, isRoomOwner, socket, lobbyId }) => {
  const navigate = useNavigate();
  const { token } = useRequireAuth();

  const handleButton = async () => {

    if (!socket) {
      console.error("Socket no está conectado");
      return;
    }

    if (isRoomOwner) {
      if (window.confirm("¿Esta seguro de que desea salir del lobby? Al hacerlo, se eliminará el lobby y todos los jugadores serán expulsados.")) 
      {
        console.log("Sending nuke to the room:", lobbyId);
        socket.emit("nukeRoom", { roomId: lobbyId });
      }
      else {
        return;
      }
    }
    else {
      socket.emit("leaveRoom", { roomId: lobbyId, userInLobbyId: userInLobbyId, reason: "userLeft" });
    }

    try {
      await axios.patch(
        `${apiUrl}/userinlobby/leave/${userInLobbyId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    
    navigate("/game");
    
    } catch (error) {
      console.error("Error al salir del lobby:", error);
    }
  };
  return (
    <div className="container-out-button">
      <button onClick={handleButton}>
        Salir
        <img src={snorlaxSprite} alt="sprite-snorlax" />
      </button>
    </div>
  );
};

export default OutButton;
