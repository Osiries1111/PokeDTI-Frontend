type FetchedRoomUser = {
  id: number;
  userId: number;
  status: string;
  dressImgUrl: string;
  choosenPokemon: number;
};

type FetchedPublicUser = {
  id: number;
  username: string;
  profileImage: string;
};

type FullRoomUser = {
  id: number; // UserInLobby ID
  userId: number; // Current User ID
  status: string;
  dressImgUrl: string;
  username: string;
  profileImage: string;
  choosenPokemon: number;
};

type RoomData = {
  id: number;
  hostId: number;
  name: string;
  maxPlayers: number;
  theme: string;
  status: string;
};

type Vote = {
  votingUserId: number;
  votedUserId: number;
};

type FetchedVotes = {
  votedBy: Vote[];
  votedFor: Vote[];
}

export type {
  FetchedRoomUser,
  FetchedPublicUser,
  FullRoomUser,
  RoomData,
  Vote,
  FetchedVotes
};