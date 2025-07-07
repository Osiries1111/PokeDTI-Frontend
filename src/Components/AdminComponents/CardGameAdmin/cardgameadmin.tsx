import React, { useEffect, useState } from 'react';
import "./cardgameadmin.css";
import axios from 'axios';
import { apiUrl } from '../../../config/consts';
import { useRequireAuth } from '../../../auth/useRequireAuth';
import { fetchUsersInLobby, updateUserInLobbyStatus } from '../../../utils/inGameRequests';
import type { FetchedRoomUser } from '../../../utils/inGameTypes';

interface Props {
    idGame: number;
    nameGame: string;
    statusGame: string;
    maxUsers: number;
    userCount: number;
}

const CardGameAdmin: React.FC<Props> = ({idGame, nameGame, statusGame, maxUsers, userCount}) => {
    const { token } = useRequireAuth(true);
    const [users, setUsers] = useState<FetchedRoomUser[]>([]);
    // Get users in this game
    useEffect(() => {

        if (!token || !idGame || statusGame === "finished" || userCount < 1) return;
        const fetchUsers = async () => {
            
            try {
                const fetchedUsers = await fetchUsersInLobby(token, idGame);
                setUsers(fetchedUsers);
            } catch (error) {
                console.error("Error fetching users in lobby:", error);
            }
        };

        fetchUsers();
    }, [token, idGame]);

    const handleDelete = async () => {
        await axios.delete(`${apiUrl}/lobbies/${idGame}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then((response) => {
            console.log("Game deleted successfully:", response.data);
            window.location.reload(); // Reload the page to reflect changes
        })
        .catch((error) => {
            console.error("Error deleting game:", error);
        });
    };

    const handleReset = async () => {
        if (!token || !idGame) return;
        await axios.patch(`${apiUrl}/lobbies/${idGame}`, {
            status: "waitingForPlayers",
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            console.log("Game reset successfully:", response.data);
            
            users.forEach((user) => {
                updateUserInLobbyStatus(token, user.id, "inLobby")
            }
            );
            window.location.reload(); // Reload the page to reflect changes
        }
        ).catch((error) => {
            console.error("Error resetting game:", error);
        }
        );
    };


    const handleFinish = async () => {
        if (!token || !idGame || statusGame === "finished") return;
        await axios.patch(`${apiUrl}/lobbies/${idGame}`, {
            status: "finished",
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }).then((response) => {
            console.log("Game finished successfully:", response.data);
            users.forEach((user) => {
                updateUserInLobbyStatus(token, user.id, "exited")
            });
            window.location.reload(); // Reload the page to reflect changes
        }
        ).catch((error) => {
            console.error("Error finishing game:", error);
        }
        );
    };

    return (
        <div className='container-user-admin-details'>
            <div>
                <h1 className='id-game-admin'>Room ID: {idGame}</h1>
                <h2 className='game-name-admin'>Room Name: {nameGame}</h2>
                <h3 className='status-game-admin'>Status: {statusGame}</h3>
                <h3 className='conected-game-admin'>Users Connected: 
                    { statusGame === "finished" ? "None" : `${userCount || 0}/${maxUsers}` }
                    </h3>
            </div>
            <div className='users-in-game-admin'>
                <h3>Users in Game:</h3>
                {users.length > 0 && (statusGame !== "finished") && (
                    <ul>
                        {users.map((user) => (
                            <li key={user.id}>
                                {user.id} - Status: {user.status}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            <div className='buttons-admin-game'>
                <button disabled={statusGame === "finished"} onClick={handleFinish}>Finish Game</button>
                <button disabled={statusGame === "finished"} onClick={handleReset}>Reset</button>
                <button onClick={handleDelete}>Delete</button>
            </div>
            
        </div>
    );
};

export default CardGameAdmin;