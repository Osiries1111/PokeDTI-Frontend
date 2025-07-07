import React, {useState} from 'react';
import "./game.css";
import { gastlySpritetwo } from '../../assets/find-game-page';
import {gengarGiga, gengarMega, gengarNormal, titleForDetails } from '../../assets/find-game-page';
import LoungeCards from '../../Components/GameComponents/LoungeCards/loungecards';
import CreateLounge from '../../Components/GameComponents/CreateLounge/createlounge';
import { useRequireAuth } from '../../auth/useRequireAuth';
import { IoRefreshOutline } from "react-icons/io5";

const Game: React.FC = () => {

    const { token } = useRequireAuth();
    const [refreshKey, setRefreshKey] = useState(0);
    
    if (!token) {
        return null;
    }

    return (
        <div className="games">
            <div className='title-and-newgame'>
                <div className='title-container'>
                    <img src={titleForDetails} alt="titleFound" className = "titlefundindexgames"/>
                    <h1 className='titleHeaderIndexGames'>Salas</h1>            
                </div>
                <button 
                className='refresh-button' 
                onClick={() => setRefreshKey(prev => prev + 1)}
                title="Recargar Salas"
                >
                    <IoRefreshOutline className='refresh-icon' />
                </button>
                <CreateLounge />
            </div>
            <div className='games-container'>
                <div className='gengar-container-1'>
                    <img src={gengarGiga} alt="gengar-gigamax" className = "gengarGigaLeft"/>
                    <img src={gengarMega} alt="gengar-mega" className = "gengarMegaLeft"/>
                    <img src={gengarNormal} alt="gengar sprite" className = "gengarNormalLeft"/>
                </div>
                <div className='roomsIndex'>
                    <LoungeCards refreshKey={refreshKey}/>
                </div>
                <div className='gengar-container-2'>
                    <img src={gengarGiga} alt="gengar-gigamax" className = "gengarGigaRight"/>
                    <img src={gengarMega} alt="gengar-mega" className = "gengarMegaRight"/>
                    <img src={gengarNormal} alt="gengar sprite" className = "gengarNormalRight"/>
                </div>
            </div>
            <div className="burbujas">
                <img src={gastlySpritetwo} alt="gastly" className="ghost-floating ghost1" />
                <img src={gastlySpritetwo} alt="gastly" className="ghost-floating ghost2" />
                <img src={gastlySpritetwo} alt="gastly" className="ghost-floating ghost3" />
                <img src={gastlySpritetwo} alt="gastly" className="ghost-floating ghost4" />
                <img src={gastlySpritetwo} alt="gastly" className="ghost-floating ghost5" />
            </div>

        </div>
    );
};

export default Game;