
export interface User {
    id: number;
    email: string;
    username: string;
    password: string;
    profileDescription: string;
    favoritePokemonId: number | null;
    type: string;
    createdAt: string;
    updatedAt: string;
    profileImgUrl?: string;

}