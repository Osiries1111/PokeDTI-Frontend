import React from 'react';
import { dislike, like } from '../../assets/votes-page';
import "./votecard.css";

interface Props {
    onDislike: (user_id: number) => void;
    onLike: (user_id: number) => void;
    user_id: number;
    pokemon: string;
    voted: boolean;

}
const VoteCard: React.FC<Props> = ({ onDislike, onLike, user_id, pokemon, voted }) => {
    return (
        <div className='container-vote'>
            <div className='pokemon-image'>
                <img src={pokemon} alt="pokemon vestido" />
            </div>
            <div className='buttons-vote'>
                {voted ? 
                (
                <button onClick={() => onDislike(user_id)}>
                    <img src={dislike} alt="dislike" />
                </button>
                ) 
                : 
                (
                <button onClick={() => onLike(user_id)}>
                    <img src={like} alt="like" />
                </button>
                )}
            </div>
        </div>
    );
};


export default VoteCard;
