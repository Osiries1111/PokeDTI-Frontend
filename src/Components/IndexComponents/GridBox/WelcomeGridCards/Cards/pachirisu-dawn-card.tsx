import './red-welcome-card.css';
import GridItem from "../../../GridBox/GridItem/grid-item.tsx";

import { backgroundDress, podiumBeauty, pachirisuDressed, modelDawn, pikachuDressed, flecha, piplupDressed } from '../../../../../assets/landing-page/index.ts';

import { useState } from "react";

export default function PachirisuDawnCard() {

    const pokemons = [pikachuDressed, piplupDressed, pachirisuDressed];
    const pkmID = ["pikachu", "piplup", "pachirisu"];
    const [showPokemon, setShowPokemon] = useState(0);
    const [fadeKey, setFadeKey] = useState(0); // For animation reset

    const handleLeftClick = () => {
        const newIndex = (showPokemon - 1 + pokemons.length) % pokemons.length;
        setShowPokemon(newIndex);
        setFadeKey(prev => prev + 1); // trigger reanimation
    };

    const handleRightClick = () => {
        const newIndex = (showPokemon + 1) % pokemons.length;
        setShowPokemon(newIndex);
        setFadeKey(prev => prev + 1); // trigger reanimation
    };

    const pachirisuDawnCard = (
        <div className={"red-welcome-card pachirisu-dawn-card"}>
            <div className={"red-welcome-card__dress"}>
                <img src={backgroundDress} alt={"Background"} id={"background-dress"} />
                <button className='arrow-button left-arrow' onClick={handleLeftClick}>
                    <img src={flecha} alt="flecha izquierda" className='arrow-image' />
                </button>
                
                <img src={podiumBeauty} alt={"Podium"} id={"podium-beauty"} />

                <img
                    key={fadeKey}
                    src={pokemons[showPokemon]}
                    alt={"Pokémon vestido"}
                    id={pkmID[showPokemon]}
                    className="fade-in"
                />

                <button className='arrow-button right-arrow' onClick={handleRightClick}>
                    <img src={flecha} alt="flecha derecha" className='arrow-image' />
                </button>
            </div>
            <div className={"red-welcome-card__dawn"}>
                <img src={modelDawn} alt={"Dawn"} id={"dawn-landing"} />
            </div>
        </div>
    );

    return (
        <GridItem component={pachirisuDawnCard} row={2} column={2} />
    );
}
