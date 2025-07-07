import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './winner.css';
import { award, cup, crownWinner, backgroundWinner } from '../../assets/winner-page';
import OutButton from '../../Components/LobbyComponents/OutButton/outbutton.tsx';
import Music from "../../Components/Music/Music.tsx";
import { CongratulationsMusic } from '../../assets/music';
import { socketUrl } from '../../config/consts.ts';
import { io, Socket } from 'socket.io-client';
import { useRequireAuth } from '../../auth/useRequireAuth.ts';
import { buildFullRoomUsers, fetchRoomData, updateLobbyStatus, fetchUserVotes, updateUserInLobbyStatus } from '../../utils/inGameRequests.ts';
import type { FullRoomUser, RoomData, FetchedVotes } from '../../utils/inGameTypes.ts';


const Winner: React.FC = () => {
    const navigate = useNavigate();
    const { id_lobby } = useParams();
    const lobbyId = parseInt(id_lobby || "-1", 10);
    const backgroundStyle = {
        backgroundImage: `url(${backgroundWinner})`
    };

    const backgroundStyle2 = {
        backgroundImage: `url(${award})`
    };

    const { token, currentUser } = useRequireAuth();

    const [winnerSocket, setWinnerSocket] = React.useState<Socket | null>(null);
    const [currentUserInLobby, setCurrentUserInLobby] = useState<FullRoomUser | null>(null);
    const [roomData, setRoomData] = useState<RoomData>({
        id: -1,
        hostId: -1,
        name: "",
        maxPlayers: 0,
        theme: "",
        status: "",
    });
    const [isHost, setIsHost] = useState<boolean>(false);

    const [winner, setWinner] = useState<FullRoomUser | null>(null);
    const [isTie, setIsTie] = useState(false);
    // Get room data and check if the user is the host
    useEffect(() => {
        if (!token || !lobbyId || !currentUser) {
            return;
        }
        fetchRoomData(
            token,
            lobbyId
        ).then((fetchedRoomData) => {
            if (!fetchedRoomData) {
                console.error("No room data returned from fetchRoomData.");
                return;
            }

            setRoomData(fetchedRoomData);
            setIsHost(
                fetchedRoomData.hostId === currentUser.id
            );
            console.log("Room data fetched:", fetchedRoomData);
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

    // Fetch users in the lobby and calculate the winner
    useEffect(() => {
        //console.log("Fetching room users and data...");
        if (!token || !lobbyId || !currentUser) {
            return;
        }
        //console.log("Fetching users in lobby and room data...");

        // 1. Obtener los usuarios en el lobby
        buildFullRoomUsers(token, lobbyId)
            .then(async (users) => {
                //console.log("Users in lobby fetched:", users);
                if (!users) {
                    console.error("No users returned from buildFullRoomUsers.");
                    return;
                }
                //setUsersInLobby(users);
                const currentUserIL = users.find(
                    (user) => user.userId === currentUser.id
                );

                if (!currentUserIL) return;
                setCurrentUserInLobby(currentUserIL);

                // 2. Consultar votos de todos los usuarios en paralelo
                const votesResults = await Promise.all(
                    users.map(async (user) => {
                        const thisUserVotes: FetchedVotes = await fetchUserVotes(token, user.id);
                        return { userId: user.id, totalVotes: thisUserVotes?.votedBy.length || 0 };
                    })
                );

                console.log("Votes results:", votesResults);

                // 3. Calcular el ganador
                const maxVotes = Math.max(...votesResults.map(v => v.totalVotes));

                // Verificar si hay un empate

                const isTie = votesResults.filter(v => v.totalVotes === maxVotes).length > 1;

                if (isTie) {
                    setIsTie(true);
                    setWinner(currentUserIL);
                    return;
                }

                const winnerId = votesResults.find(v => v.totalVotes === maxVotes)?.userId;
                const winnerUser = users.find((user) => user.id === winnerId) || null;
                setWinner(winnerUser);
                console.log("Winner user:", winnerUser);
                //setCurrentVote(users[index]);
            })
            .catch((error) => {
                console.error("Error fetching users in lobby:", error);
            });
    }, [token, lobbyId, currentUser]);

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

        setWinnerSocket(socket);
        // On connection events
        socket.on("connect", () => {
            console.log("Conectado al socket de pokeDTI");
            socket.emit("message", "¡Hola desde votes! Room ID: " + roomData.id);
            socket.emit("joinRoom", {
                roomId: lobbyId,
                user: currentUserInLobby,
                gameStage: "displayingResults",
            });
        });

        socket.on("stageChange", async (data: { lobbyId: number; newStatus: string }) => {
            if (data.lobbyId === lobbyId) {
                console.log(`Estado del lobby actualizado a: ${data.newStatus}`);
            }
            if (data.newStatus === "waitingForPlayers") {
                console.log(
                    "Redirigiendo al lobby"
                );
                try {
                    await updateUserInLobbyStatus(
                        token,
                        currentUserInLobby?.id || -1,
                        "inLobby"
                    );
                    navigate(`/lobby/${lobbyId}`);
                } catch (error) {
                    console.error("Error updating user status in lobby:", error);
                    return;
                }
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
    }, [token, currentUser, currentUserInLobby]);

    const handleHostReturn = async () => {
        if (!isHost || !winnerSocket || !token ) return;

        try {
            await updateLobbyStatus(token, lobbyId, "waitingForPlayers");
            console.log("Estado del lobby actualizado a: waitingForPlayers");

            winnerSocket.emit("patchLobbyOk", {
                lobbyId: lobbyId,
                newStatus: "waitingForPlayers",
            });
        } catch (error) {
            console.error("Error al actualizar el estado del lobby:", error);
        }
    }

    return (
        <div className="container-winner" style={backgroundStyle}>
            <div>
                {isHost && (
                <button className='host-return-btn' onClick={handleHostReturn} > Volver al lobby </button> )}
                <OutButton lobbyId={lobbyId} userInLobbyId={currentUserInLobby?.id || -1} isRoomOwner={isHost} socket={winnerSocket} />
            </div>
            <div className='award-header'>
                <img src={crownWinner} alt="corona" />
                <h1>{ isTie? "¡Empate!" : winner?.username }</h1>
            </div>
            <div className='container-award' style={backgroundStyle2}>

                <div className='award-body'>
                    <img src={cup} alt="cup" />
                    <img src={winner?.dressImgUrl} alt="pokemon-dressed" />
                    <img src={cup} alt="cup" />
                </div>
            </div>
            <Music src={CongratulationsMusic} />
        </div>
    );

}

export default Winner;