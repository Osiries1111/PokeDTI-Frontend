import React, { useRef, useEffect, useState } from "react";
import "./dress.css";
import { useParams, useNavigate } from "react-router-dom";

import { backgroundFound, circleTime, yoshiEgg } from "../../assets/dress-page";
import { DressMusic } from "../../assets/music";
import { textBox } from "../../assets/others";

import OutButton from "../../Components/LobbyComponents/OutButton/outbutton.tsx";
import DemoGame from "../../Components/DemoGame/demogame";
import type { DemoGameHandle } from "../../Components/DemoGame/demogame";
import { useRequireAuth } from "../../auth/useRequireAuth.ts";
import { fetchRoomData } from "../../utils/inGameRequests.ts";
import Music from "../../Components/Music/Music.tsx";
import {
  updateLobbyStatus,
  getMyUserInLobby,
  updateUserInLobbyStatus,
} from "../../utils/inGameRequests.ts";
import { socketUrl } from "../../config/consts.ts";
import { io, Socket } from "socket.io-client";
import type { FullRoomUser } from "../../utils/inGameTypes.ts";

const Dress: React.FC = () => {
  const navigate = useNavigate();
  const { id_lobby } = useParams();
  const [timeLeft, setTimeLeft] = useState(60); // Tiempo de 1 minuto
  const demoRef = useRef<DemoGameHandle>(null);
  const isDemo = false;

  const lobbyId = parseInt(id_lobby || "-1", 10);

  const backgroundStyle = {
    backgroundImage: `url(${backgroundFound})`,
  };

  const { token, currentUser } = useRequireAuth();

  const [roomData, setRoomData] = useState({
    id: -1,
    hostId: -1,
    name: "",
    maxPlayers: 0,
    theme: "",
    status: ""
  });
  const [currentUserInLobby, setCurrentUserInLobby] =
    useState<FullRoomUser | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [dressSocket, setDressSocket] = useState<Socket | null>(null);
  const [amIReady, setAmIReady] = useState(false);
  const [loading, setLoading] = useState(false);

  //Obtener informacion del lobby
  useEffect(() => {
    if (!token || !lobbyId || !currentUser) return;

    fetchRoomData(token, lobbyId).then(
      (data) => {
        if (!data) {
          console.error("No se pudo obtener la información del lobby.");
          return;
        }
        setRoomData(data);
        setIsHost(data.hostId === currentUser.id);
        console.log("Datos del lobby obtenidos:", data);
      }
    ).catch(
      (error) => {
        if (error.response && error.response.status === 404) {
          navigate("/game");
          return;
        }
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
          return;
        }
        alert(
          "Error al obtener los datos del lobby. Inténtalo de nuevo más tarde."
        );
      }
    );
  }, [lobbyId, token, currentUser]);

  // Get my user in lobby
  useEffect(() => {
    if (!currentUser || !token) return;

    if (lobbyId < 0) {
      console.error("Lobby ID inválido:", lobbyId);
      return;
    }
    // Obtener el usuario actual en el lobby
    getMyUserInLobby(currentUser, token, lobbyId)
      .then((userInLobby) => {
        if (!userInLobby) {
          console.error("Usuario en el lobby no encontrado.");
          return;
        }
        // agregar username y profileImage al usuario en el lobby
        userInLobby.username = currentUser.username;
        userInLobby.profileImage = currentUser.profileImgUrl;
        setCurrentUserInLobby(userInLobby);
        if (userInLobby.status === "finishedDressing") {
          //console.log("Usuario ya ha terminado de vestir.");
          setAmIReady(true);
        }
      })
      .catch((error) => {
        console.error("Error al obtener el usuario en el lobby:", error);
      });


  }, [lobbyId, token, currentUser]);

  // Timer para el juego de vestir
  useEffect(() => {
    if (!token) return;
    if (timeLeft <= 0) {
      (async () => {
        setLoading(true);
        await handleSaveFromParent();
        await updateUserInLobbyStatus(token, currentUserInLobby?.id || -1, "finishedDressing");
        setLoading(false);
        dressSocket?.emit("userFinishedDressing", {
          userInLobbyId: currentUserInLobby?.id || -1,
          roomId: lobbyId,
        });
      })();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, id_lobby, token]);

  // Conectar al socket y unirse al lobby
  useEffect(() => {
    if (!token || !currentUser || !currentUserInLobby) return;
    const socket: Socket = io(socketUrl, {
      auth: {
        token: token,
        userId: currentUser.id,
        lobbyId: lobbyId,
        username: currentUser.username,
      },
    });

    setDressSocket(socket);
    // On connection events
    socket.on("connect", () => {
      console.log("Conectado al socket de pokeDTI");
      socket.emit("message", "¡Hola desde dress!");
      socket.emit("joinRoom", {
        roomId: lobbyId,
        user: currentUserInLobby,
        gameStage: "dressing",
      });
    });

    // When all users are ready to change stage, change the lobby status
    socket.on("usersReady", ({ newStatus }: { newStatus: string }) => {
      if (isHost) {
        console.log(
          `Todos los usuarios están listos para ${newStatus}, modificando estado del lobby`
        );

        updateLobbyStatus(token, lobbyId, newStatus)
          .then(() => {
            console.log("Estado del lobby actualizado a:", newStatus);
            // Emitir un evento para notificar al back que el patch fue exitoso en la base de datos
            socket.emit("patchLobbyOk", {
              lobbyId: lobbyId,
              newStatus: newStatus
            });
          })
          .catch((error) => {
            console.error("Error al actualizar el estado del lobby:", error);
          });
      }
    });

    socket.on(
      "stageChange",
      (data: { lobbyId: number; newStatus: string }) => {
        if (data.lobbyId === lobbyId) {
          console.log(`Estado del lobby actualizado a: ${data.newStatus}`);
        }

        if (data.newStatus === "voting") {

          updateUserInLobbyStatus(
            token,
            currentUserInLobby?.id || -1,
            "voting",
          ).then(() => {
            console.log(
              "El juego ha comenzado, redirigiendo a la página de votacion");
            navigate(`/votes/${lobbyId}`);
          }).catch((error) => {
            console.error("No hemos podido enviarte a la página de votación", error);
          });
        }
      }
    );

    socket.on("gameStopped", async (data: { message: string }) => {
      alert(data.message);
      if (isHost) {
        await updateLobbyStatus(
          token,
          lobbyId,
          "waitingForPlayers"
        );
      }

      await updateUserInLobbyStatus(
          token,
          currentUserInLobby?.id || -1,
          "inLobby"
      );
      
      navigate(`/lobby/${lobbyId}`);
    });

    socket.on("disconnectAll", (roomId: number) => {
      if (roomId !== lobbyId) return;

      updateUserInLobbyStatus(
        token,
        currentUserInLobby?.id || -1,
        "exited"
      ).then(() => {
        socket.emit("leaveRoom", {
          roomId: lobbyId,
          userInLobbyId: currentUserInLobby?.id || -1,
          reason: "ownerDisconnected",
        });
        if (!isHost) {
          alert(
            "Te hemos expulsado del lobby porque el dueño se ha desconectado."
          );
          navigate("/game");
        }
      });
    });

    return () => {
      socket.disconnect();
    };
  }, [token, currentUser, currentUserInLobby]);

  // Jugador ha terminado de vestir. Guardar imagen y actualizar estado
  const handleSaveFromParent = async () => {
    if (!token || !currentUserInLobby || !lobbyId) return;
    if (demoRef.current) {
      setLoading(true);
      await demoRef.current.generateImageAndUpload();
      await updateUserInLobbyStatus(
        token,
        currentUserInLobby?.id || -1,
        "finishedDressing"
      );

      dressSocket?.emit("userFinishedDressing", {
        userInLobbyId: currentUserInLobby?.id || -1,
        lobbyId: lobbyId,
      });

      setLoading(false);
      setAmIReady(true);
    }

    // navigate(`/lobby/${id_lobby}`);
  };

  if (!token) return null;

  return (
    <div className="container-page-dress" style={backgroundStyle}>
      <div className="container-game-demo-game">
        <DemoGame
          pokedexId={currentUserInLobby?.choosenPokemon || -1}
          id_demo={isDemo}
          ref={isDemo ? undefined : demoRef}
          token={token}
          currentUserId={currentUserInLobby?.userId || -1}
        />
      </div>
      <div className="container-info-opcions-dress">
        <div className="container-title-time-dress">
          <div className="container-title-dress-c">
            <img src={textBox} alt="" />
            <h3>Viste el Pokémon de acuerdo al tema</h3>
          </div>
          <div className="container-time-dress">
            <img src={circleTime} alt="" />
            <h2>{timeLeft}</h2>
          </div>
        </div>
        <div className="container-tema-dress">
          <h2>Tema: {roomData.theme}</h2>
        </div>
        <div className="container-buttons-dress">
          <div className="container-out-button">
            <button onClick={handleSaveFromParent} disabled={timeLeft <= 0}>
              Terminar
              <img src={yoshiEgg} alt="yoshi-egg" />
            </button>
          </div>
          <div>
            <OutButton
              lobbyId={lobbyId}
              isRoomOwner={isHost}
              socket={dressSocket}
              userInLobbyId={currentUserInLobby?.id || -1}
            />
          </div>
        </div>
      </div>
      <Music src={DressMusic} />
      {(loading || amIReady) && (
        <div className="waiting-for-others-overlay">
          <div className="waiting-for-others-content">
            <h2>{ amIReady ?  "Esperando a que los demás terminen..." : "Un momento por favor..."}</h2>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dress;
