import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./lobby.css";
import { useParams } from "react-router-dom";
import { backgroundLobby, pokeball } from "../../assets/lobby-page";
import { LobbyMusic } from "../../assets/music";
import UserGameCard from "../../Components/LobbyComponents/UserGameCard/usergamecard.tsx";
import OutButton from "../../Components/LobbyComponents/OutButton/outbutton.tsx";
import { useRequireAuth } from "../../auth/useRequireAuth.ts";
import Music from "../../Components/Music/Music.tsx";
import { socketUrl } from "../../config/consts.ts";
import { ribbons } from "../../assets/perfil-page/ribbons/index";

import { io, Socket } from "socket.io-client";

import { buildFullRoomUsers, fetchRoomData, updateLobbyStatus, getMyUserInLobby, updateUserInLobbyStatus, cancelAllVotesInRoom } from "../../utils/inGameRequests.ts";

import type {
  FullRoomUser,
  RoomData,
} from "../../utils/inGameTypes.ts";

const Lobby: React.FC = () => {
  const navigate = useNavigate();
  const { numero } = useParams(); // <--- con esto se qué número soy de lobby :)
  const lobbyId = parseInt(numero || "-1", 10);

  // States

  const [roomUsers, setRoomUsers] = useState<FullRoomUser[]>([]); // Estado para almacenar los usuarios en el lobby
  const [roomData, setRoomData] = useState<RoomData>({
    id: -1,
    hostId: -1,
    name: "",
    maxPlayers: 0,
    theme: "",
    status: ""
  });
  const [roomAmount, setRoomAmount] = useState<number>(0); // Estado para almacenar la cantidad de usuarios en el lobby
  const [currentUserInLobby, setCurrentUserInLobby] =
    useState<FullRoomUser | null>(null); // Estado para almacenar el usuario actual en el lobby


  const [isRoomOwner, setIsRoomOwner] = useState<boolean>(false); // Es el usuario actual el dueño del lobby?

  const [newSocket, setNewSocket] = useState<Socket | null>(null); // Estado para almacenar la conexión del socket

  const [lobbyIsReady, setLobbyIsReady] = useState<boolean>(false); // Estado para saber si el lobby está listo para iniciar el juego

  const [updateRoomIndex, setUpdateRoomIndex] = useState<number>(0); // Estado para forzar la actualización del componente

  const [loading, setLoading] = useState<boolean>(false); // Estado para controlar la carga de datos

  const [gameStartLoading, setGameStartLoading] = useState<boolean>(false); // Estado para controlar la carga al iniciar el juego

  const backgroundStyle = {
    backgroundImage: `url(${backgroundLobby})`,
  };
  // Auth

  const { token, currentUser } = useRequireAuth();

  // Conectar al socket y unirse al lobby

  useEffect(() => {
    if (!currentUser || !currentUserInLobby || !token) return;

    const newSocket: Socket = io(socketUrl, {
      auth: {
        userId: currentUser.id,
        username: currentUser.username,
        lobbyId: lobbyId,
        userInLobbyId: currentUserInLobby.id,
        isHost: isRoomOwner,
      }
    });

    setNewSocket(newSocket);

    // On connection events
    newSocket.on("connect", () => {
      console.log("Conectado al socket del lobby");
      newSocket.emit("message", "¡Hola desde el lobby!");
      newSocket.emit("joinRoom", { roomId: lobbyId, user: currentUserInLobby, gameStage: "waitingForPlayers" });
    });

    // In room events

    newSocket.on("roomUsersUpdate", (updatedRoomUsers: FullRoomUser[]) => {
      //console.log("Usuarios en el lobby actualizados:", updatedRoomUsers);
      setRoomUsers(updatedRoomUsers);
      setRoomAmount(updatedRoomUsers.length);
    });

    newSocket.on("roomDataUpdate", () => {

      setUpdateRoomIndex(prev => prev + 1);

    });
    newSocket.on("readyNotice", (isReady: { isRoomReady: boolean }) => {
      setLobbyIsReady(isReady.isRoomReady);
    });

    // When all users are ready to change stage, change the lobby status
    newSocket.on("usersConfirmed", ({ newStatus }: { newStatus: string }) => {

      //console.log("Users cofirmed. Waiting for host to update lobby status...");

      if (isRoomOwner) {
        //console.log(`Todos los usuarios están listos para ${newStatus}, modificando estado del lobby`);

        updateLobbyStatus(token, lobbyId, newStatus)
          .then(async () => {
            console.log(`Estado del lobby actualizado a: ${newStatus}`);
            try {

              await cancelAllVotesInRoom(token, lobbyId);
              console.log("Todas los votos han sido eliminados en el lobby:", lobbyId);
              newSocket.emit('patchLobbyOk', { lobbyId, newStatus });

            } catch (error) {
              console.error("Error al cancelar las votaciones en el lobby:", error);
              setGameStartLoading(false);
            }


          })
          .catch((error) => {
            console.error("Error al actualizar el estado del lobby:", error);
            setGameStartLoading(false);
          });
      }
    });

    newSocket.on("stageChange", async (data: { lobbyId: number, newStatus: string }) => {
      //if (data.lobbyId === lobbyId) {
      //  console.log(`Estado del lobby actualizado a: ${data.newStatus}`);
      //}

      //console.log("Cambio de etapa recibido:", data.newStatus);

      if (data.newStatus === "dressing") {
        console.log("El juego ha comenzado, redirigiendo a la página de vestir");
        updateUserInLobbyStatus(token, currentUserInLobby.id, "dressing")
          .then(() => {
            console.log("Estado del usuario actualizado a 'dressing'");
            navigate(`/dress/${lobbyId}`);
          }).catch((error) => {
            console.error("Error al actualizar el estado del usuario en el lobby:", error);
            alert("Error al ingresar a la etapa de vestir. Se te devolverá a la página de inicio.");
            navigate("/game");

          });
      }



    });

    newSocket.on("gameStartError", (data: { message: string }) => {
      if (!isRoomOwner) return;
      alert("Error al iniciar el juego: " + data.message);
      console.error("Error al iniciar el juego:", data.message);
    });


    // Disconnect events

    newSocket.on(
      "youWereKicked",
      (data: { userId: number; roomId: number }) => {
        //console.log("Ha sido expulsado del lobby:", data);
        if (
          data.userId === currentUserInLobby?.userId &&
          data.roomId === lobbyId
        ) {
          alert("Has sido expulsado del lobby.");
          navigate("/game");
        }
      }
    );

    newSocket.on("disconnectAll", (roomId: number) => {
      if (roomId !== lobbyId) return;
      updateUserInLobbyStatus(
        token,
        currentUserInLobby?.id || -1,
        "exited"
      ).then(() => {
        newSocket.emit("leaveRoom", {
          roomId: lobbyId,
          userInLobbyId: currentUserInLobby?.id || -1,
          reason: "ownerDisconnected",
        });
        if (!isRoomOwner) {
          alert(
            "Te hemos expulsado del lobby porque el dueño se ha desconectado."
          );
          navigate("/game");
        }
      })
    });

    return () => {
      newSocket.disconnect();
    };

  }, [token, currentUser, currentUserInLobby]);

  // Get room data

  useEffect(() => {
    if (!token || !currentUser || lobbyId < 0) return;

    setLoading(true);

    Promise.allSettled([
      buildFullRoomUsers(token, lobbyId)
        .then(async (fetchedRoomUsers) => {
          if (!fetchedRoomUsers) throw new Error("No se pudieron obtener los usuarios del lobby.");
          const myUserInLobby = await getMyUserInLobby(currentUser, token, lobbyId);
          if (!myUserInLobby) throw new Error("No se pudo encontrar el usuario actual en el lobby.");
          const myFullUser: FullRoomUser = {
            ...myUserInLobby,
            username: currentUser.username,
            profileImage: currentUser.profileImgUrl,
          };
          setCurrentUserInLobby(myFullUser);
        })
        .catch((error) => {
          console.error("Error al obtener los usuarios en el lobby:", error);
          navigate("/game");
        }),

      fetchRoomData(token, lobbyId)
        .then((fetchedRoomData) => {
          if (!fetchedRoomData) throw new Error("No se pudieron obtener los datos del lobby.");
          setRoomData(fetchedRoomData);
          setIsRoomOwner(fetchedRoomData.hostId === currentUser.id);
        })
        .catch((error) => {
          if (error.response && (error.response.status === 404 || error.response.status === 403)) {
            console.error("Error al obtener los datos del lobby:", error);
            alert("Lobby no encontrado o no tienes permiso para acceder.");
            navigate("/game");
          } else {
            console.error("Error inesperado al obtener los datos del lobby:", error);
            alert("Error al obtener los datos del lobby. Inténtalo de nuevo más tarde.");
          }
        }),
    ]).finally(() => setLoading(false));
  }, [lobbyId, token, currentUser, updateRoomIndex]);

  const handleButton = () => {

    if (!newSocket || !currentUserInLobby) {
      console.error("Socket no está conectado o usuario actual no está definido.");
      return;
    }

    if (!isRoomOwner && !lobbyIsReady) {
      return;
    }
    setGameStartLoading(true);
    newSocket?.emit("requestStartGame", { roomId: lobbyId });
  };


  if (!token) {
    return null;
  }

  if (loading) {
    return (
      <div className="lobby-background" style={backgroundStyle}>
        <h2 style={{ textAlign: "center", marginTop: "40px" }}>Cargando lobby...</h2>
      </div>
    );
  }

  return (
    <div className="lobby-background" style={backgroundStyle}>
      <div className="title-container-lobby">
        <div className="title-left">
          <h2 className="total-people-on-game">
            {roomAmount}/{roomData.maxPlayers} jugadores
          </h2>
        </div>

        <div className="title-center">
          <h1 className="title-lobby">{roomData.name}</h1>
        </div>

        <div className="title-right">
          <OutButton
            userInLobbyId={currentUserInLobby?.id || -1}
            isRoomOwner={isRoomOwner}
            socket={newSocket}
            lobbyId={lobbyId}
          />
        </div>
      </div>
      <div className="container-play-button">
        {isRoomOwner ? (
          <button onClick={handleButton} disabled={!lobbyIsReady || gameStartLoading} className={`play-button ${lobbyIsReady ? "" : "not-ready"}`}>
            Jugar
            <img src={pokeball} alt="pokeball-sprite" />
          </button>
        ) : (
          lobbyIsReady ? (<p> Esperando a que el host inicie la partida </p>) : (<p> Esperando a que todos elijan un pokemon </p>)
        )}
      </div>
      <div className="container-card-users-on-game">
        {roomUsers.map((user, index) => (
          <UserGameCard
            key={index}
            owner_id={roomData.hostId}
            roomId={lobbyId}
            thisCardUserInLobbyId={user.id}
            thisCardUserId={user.userId}
            currentUserId={currentUser?.id || -1}
            nameUserGame={user.username}
            imageUserGame={user.profileImage}
            imageliston={ribbons["sinnoh"][0]}
            id_pokemon={user.choosenPokemon}
            socket={newSocket}
            currentRoomName={roomData.name}
            currentRoomMaxParticipants={roomData.maxPlayers}
            currentRoomTheme={roomData.theme}
          />
        ))}
      </div>
      {gameStartLoading && (
        <div className="game-start-loading-overlay">
          <div className="game-start-loading-box">
            <span className="game-start-spinner" />
            <p>Iniciando el juego...</p>
          </div>
        </div>
      )}
      <Music src={LobbyMusic} />

    </div>
  );
};

export default Lobby;
