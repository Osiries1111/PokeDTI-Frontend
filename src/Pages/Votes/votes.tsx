import React, { useEffect, useState } from "react";
import "./votes.css";
import { useParams, useNavigate } from "react-router-dom";
import { useRequireAuth } from "../../auth/useRequireAuth";

import { voteBackground, votesSecundBack } from "../../assets/votes-page";
import { flecha } from "../../assets/landing-page";
import { textBox } from "../../assets/others";
import { yoshiEgg } from "../../assets/dress-page";
import { VotesMusic } from "../../assets/music";

import Music from "../../Components/Music/Music.tsx";
import VoteCard from "../../Components/VoteCard/votecard";
import OutButton from "../../Components/LobbyComponents/OutButton/outbutton.tsx";
import ReportButton from "../../Components/ReportButton/reportbutton";

import { socketUrl } from "../../config/consts.ts";
import { io, Socket } from "socket.io-client";
import {
  fetchRoomData,
  updateUserInLobbyStatus,
  updateLobbyStatus,
  buildFullRoomUsers,
  createVote,
  fetchUserVotes,
  cancelVote
} from "../../utils/inGameRequests.ts";

import type { FullRoomUser, FetchedVotes } from "../../utils/inGameTypes.ts";

const Votes: React.FC = () => {
  const navigate = useNavigate();
  const { id_lobby } = useParams();
  const lobbyId = parseInt(id_lobby || "-1", 10);
  const [index, setIndex] = useState(0);
  const [animationClass, setAnimationClass] = useState("vote-card-animated");
  const [usersInLobby, setUsersInLobby] = useState<FullRoomUser[]>([]);
  const [roomData, setRoomData] = useState({
    id: -1,
    hostId: -1,
    name: "",
    maxPlayers: 0,
    theme: "",
    status: "",
  });
  const [finishedVoting, setFinishedVoting] = useState(false); // When times up or user clicks finish
  const [currentUserInLobby, setCurrentUserInLobby] =
    useState<FullRoomUser | null>(null);
  const [isHost, setIsHost] = useState(false);
  const [voteSocket, setVotesSocket] = useState<Socket | null>(null);
  const [votes, setVotes] = useState<Map<number, boolean>>(
    new Map<number, boolean>()
  ); // Map to track if a user has voted for each user in the lobby

  const currentVote = usersInLobby[index] || {
    id: -1,
    userId: -1,
    dressImageUrl: "",
    status: "",
    choosenPokemon: -1,
    username: "",
    profileImage: "",
  };

  const { token, currentUser } = useRequireAuth();

  // Get room users and room data

  useEffect(() => {
    //console.log("Fetching room users and data...");
    if (!token || !lobbyId || !currentUser) {
      return;
    }
    //console.log("Fetching users in lobby and room data...");
    buildFullRoomUsers(token, lobbyId)
      .then(async (users) => {
        //console.log("Users in lobby fetched:", users);
        if (!users) {
          console.error("No users returned from buildFullRoomUsers.");
          return;
        }
        setUsersInLobby(users);
        const currentUserIL = users.find(
          (user) => user.userId === currentUser.id
        );

        if (!currentUserIL) return;
        setCurrentUserInLobby(currentUserIL);

        const fetchedRoomData = await fetchRoomData(
          token,
          lobbyId
        )

        if (!fetchedRoomData) {
          console.error("No room data returned from fetchRoomData.");
          return;
        }

        setRoomData(fetchedRoomData);
        setIsHost(fetchedRoomData.hostId === currentUser.id);

        if (currentUserIL.status === "voted") {
          setFinishedVoting(true);
          return
        }
        const fetchedVotes: FetchedVotes = await fetchUserVotes(token, currentUserIL.id);
        const initialVotesMap = new Map<number, boolean>();
        users.forEach((user) => {
          // If a vote exists for the user, set it to true, otherwise false
          initialVotesMap.set(user.id, fetchedVotes.votedBy.some(vote => vote.votedUserId === user.id));
        });

        setVotes(initialVotesMap);

      })
      .catch((error) => {
        if (error.response && error.response.status === 404) {
          navigate("/notfound");
          return;
        }
        if (error.response && error.response.status === 403) {
          navigate("/forbidden");
          return;
        }
      });
  }, [token, lobbyId, currentUser]);

  // Conectar al socket y unirse al lobby
  useEffect(() => {
    if (!token || !currentUser || !currentUserInLobby || !roomData) return;

    const socket: Socket = io(socketUrl, {
      auth: {
        token: token,
        userId: currentUser.id,
        lobbyId: lobbyId,
        username: currentUser.username,
      },
    });

    setVotesSocket(socket);
    // On connection events
    socket.on("connect", () => {
      console.log("Conectado al socket de pokeDTI");
      socket.emit("message", "¡Hola desde votes!");
      socket.emit("joinRoom", {
        roomId: lobbyId,
        user: currentUserInLobby,
        gameStage: "voting",
      });
    });

    // When all users are ready to change stage, change the lobby status
    socket.on("usersReady", ({ newStatus }: { newStatus: string }) => {
      //console.log("Todos los usuarios están listos para cambiar de etapa:", newStatus);
      if (isHost) {
        //console.log(
        //  `Todos los usuarios están listos para ${newStatus}, modificando estado del lobby`
        //);

        updateLobbyStatus(token, lobbyId, newStatus)
          .then(() => {
            console.log("Estado del lobby actualizado a:", newStatus);
            // Emitir un evento para notificar al back que el patch fue exitoso en la base de datos
            socket.emit("patchLobbyOk", {
              lobbyId: lobbyId,
              newStatus: newStatus,
            });
          })
          .catch((error) => {
            console.error("Error al actualizar el estado del lobby:", error);
          });
      }
    });

    socket.on("stageChange", (data: { lobbyId: number; newStatus: string }) => {
      if (data.lobbyId === lobbyId) {
        console.log(`Estado del lobby actualizado a: ${data.newStatus}`);
      }

      if (data.newStatus === "displayingResults") {
        console.log(
          "Redirigiendo a la página de ganadores"
        );
        navigate(`/winner/${lobbyId}`);
      }
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
      })
    });

    return () => {
      socket.disconnect();
    };
  }, [token, currentUser, currentUserInLobby, roomData]);

  const triggerAnimation = () => {
    setAnimationClass(""); // reset
    requestAnimationFrame(() => {
      setAnimationClass("vote-card-animated"); // reapply for animation
    });
  };

  const handleNext = () => {
    setIndex((prev) => {
      const next = (prev + 1) % usersInLobby.length;
      return next;
    });
    //setCurrentVote(usersInLobby[index]);
    triggerAnimation();
  };

  const handlePrev = () => {
    setIndex((prev) => {
      const next = (prev - 1 + usersInLobby.length) % usersInLobby.length;
      return next;
    });
    //setCurrentVote(usersInLobby[index]);
    triggerAnimation();
  };

  // Handle button click to finish voting
  const handleButton = async () => {
    if (!token || !currentUserInLobby || !lobbyId) return;

    await updateUserInLobbyStatus(
      token,
      currentUserInLobby?.id || -1,
      "voted"
    )

    setFinishedVoting(true);

    voteSocket?.emit("userFinishedVoting", { userInLobbyId: currentUserInLobby?.id || -1, lobbyId: lobbyId });

    //console.log("El usuario ha terminado la votación, redirigiendo a lobby");
    //navigate(`/lobby/${id_lobby}`);
  };

  const handleLike = async (user_id: number) => {

    if (!token || !currentUserInLobby || !lobbyId) return;

    console.log("Like", user_id);

    await createVote(token, currentUserInLobby.id, user_id);
    setVotes((prevVotes) => new Map(prevVotes).set(user_id, true)); // Update the votes map
    //handleNext();
  };

  const handleDislike = async (user_id: number) => {
  if (!token || !currentUserInLobby || !lobbyId) return;
    console.log("Dislike", user_id);
    await cancelVote(token, currentUserInLobby.id, user_id);
    setVotes((prevVotes) => new Map(prevVotes).set(user_id, false)); // Update the votes map
  };

  const backgroundStyle = {
    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${voteBackground})`,
  };

  const backgroundStyle_2 = { backgroundImage: `url(${votesSecundBack})` };

  if (!token) {
    return null;
  }

  return (
    <div className="container-page-votes" style={backgroundStyle}>
      <div className="container-title-buttons-votes">
        <div>
          <ReportButton
            idUserReport={currentUserInLobby?.id || -1}
            idUserReported={currentVote.id}
          />
        </div>

        <div className="title-box">
          <h1 className="up-title-vo">Votación</h1>
          <img src={textBox} alt="caja de texto" className="textBox-rules-vo" />
        </div>

        <div>
          <OutButton
            lobbyId={lobbyId}
            userInLobbyId={currentUserInLobby?.id || -1}
            isRoomOwner={isHost}
            socket={voteSocket}
          />
        </div>
      </div>

      <div className="container-pokemon-dress-vote" style={backgroundStyle_2}>
        <img
          src={flecha}
          alt="arrow-votes-left"
          className="arrow-votes-left"
          onClick={handlePrev}
        />

        <div className={`vote-card-wrapper ${animationClass}`}>
          <VoteCard
            key={currentVote.userId}
            onDislike={handleDislike}
            onLike={handleLike}
            user_id={currentVote.id}
            pokemon={currentVote.dressImgUrl}
            voted={votes.get(currentVote.id) || false}
          />
        </div>

        <img
          src={flecha}
          alt="arrow-votes-right"
          className="arrow-votes-right"
          onClick={handleNext}
        />
      </div>

      <div className="terminar-button">
        <div className="container-out-button">
          <button onClick={handleButton}>
            Terminar
            <img src={yoshiEgg} alt="yoshi-egg" />
          </button>
        </div>
      </div>
      <Music src={VotesMusic} />
      {finishedVoting && (
        <div className="waiting-for-others-overlay">
          <div className="waiting-for-others-content"> {/* El servidor notificará cuando estén todos listos */}
            <h2>Esperando a que los demás jugadores de {roomData.name} terminen de votar...</h2>
          </div>
        </div>
      )}
    </div>

  );
};

export default Votes;
