import axios from "axios";
import { apiUrl } from "../config/consts";
import type {
    FetchedRoomUser,
    FetchedPublicUser,
    FullRoomUser,
    RoomData,
    FetchedVotes
} from "./inGameTypes";
import type { User } from "../auth/authTypes";

const fetchUsersInLobby = async (token: string, lobbyId: number) => {
    const response = await axios.get(`${apiUrl}/lobbies/${lobbyId}/users`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const fetchPublicUsers = async (fetchedUsersInRoom: FetchedRoomUser[], token: string) => {
    const response = await axios.get(`${apiUrl}/users/public`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            ids: fetchedUsersInRoom.map((user) => user.userId).join(","),
        },
    });
    return response.data;
};

const updateLobbyStatus = async (token: string, lobbyId: number, status: string) => {
    const response = await axios.patch(`${apiUrl}/lobbies/${lobbyId}`, {
        status: status,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const updateUserInLobbyStatus = async (token: string, userInLobbyId: number, status: string) => {
    const response = await axios.patch(`${apiUrl}/userinlobby/${userInLobbyId}`, {
        status: status,
    }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};

const buildFullRoomUsers = async (token: string,
    lobbyId: number
) => {
    const fetchedUsersInRoom = await fetchUsersInLobby(token, lobbyId);
    if (!fetchedUsersInRoom) throw new Error("No users found in the room.");
    const fetchedPublicUsers = await fetchPublicUsers(fetchedUsersInRoom, token);
    if (!fetchedPublicUsers) throw new Error("No public users found for the room users.");

    const fullRoomUsers: FullRoomUser[] = fetchedUsersInRoom.map(
        (roomUser: FetchedRoomUser) => {
            const publicUser = fetchedPublicUsers.find(
                (user: FetchedPublicUser) => user.id === roomUser.userId
            );
            return {
                ...roomUser,
                username: publicUser ? publicUser.username : "Usuario Desconocido",
                profileImage: publicUser ? publicUser.profileImgUrl : "",
            };
        }
    );
    return fullRoomUsers;
};

const getMyUserInLobby = async (currentUser: User | null, token: string, lobbyId: number) => {
    if (!currentUser) {
        console.error("No hay usuario actual.");
        throw new Error("No hay usuario actual.");
    }
    const response = await axios.get(`${apiUrl}/userinlobby/me/${currentUser.id}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
        params: {
            lobby: lobbyId,
        },
    });
    return response.data;
}

const fetchRoomData = async (token: string,
    lobbyId: number
) => {
    const response = await axios.get(`${apiUrl}/lobbies/${lobbyId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data as RoomData;


};

const fetchUserVotes = async (token: string, userInLobbyId: number) => {
    const response = await axios.get(`${apiUrl}/userinlobby/${userInLobbyId}/votes`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
};

const createVote = async (token: string, votingUserInLobbyId: number, votedUserInLobbyId: number) => {
    const response = await axios.post(`${apiUrl}/userinlobby/${votingUserInLobbyId}/votesFor/${votedUserInLobbyId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
};

const cancelVote = async (token: string, votingUserInLobbyId: number, votedUserInLobbyId: number) => {
    const response = await axios.delete(`${apiUrl}/userinlobby/${votingUserInLobbyId}/votesFor/${votedUserInLobbyId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        },
    });
    return response.data;
};

const cancelAllVotesInRoom = async (token: string, lobbyId: number) => {
    const usersInRoom: FetchedRoomUser[] = await fetchUsersInLobby(token, lobbyId);
    if (!usersInRoom) return;
    const usersVotes = await Promise.all(usersInRoom.map(async (user: FetchedRoomUser) => {
        const userVotes: FetchedVotes = await fetchUserVotes(token, user.id);
        if (!userVotes) return [];
        return userVotes.votedFor.map((vote) => cancelVote(token, user.id, vote.votedUserId));
    }
    ));
    await Promise.all(usersVotes.flat());
    console.log("All votes cancelled in room:", lobbyId);
}

export {
    fetchUsersInLobby,
    fetchPublicUsers,
    updateLobbyStatus,
    buildFullRoomUsers,
    fetchRoomData,
    updateUserInLobbyStatus,
    getMyUserInLobby,
    fetchUserVotes,
    createVote,
    cancelVote,
    cancelAllVotesInRoom
};