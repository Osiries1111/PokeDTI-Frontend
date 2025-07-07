import './red-welcome-card.css';
import GridItem from "../../../GridBox/GridItem/grid-item.tsx";

import { bulbPlushie, charPlushie, squirtlePlushie, pokeballSprite } from '../../../../../assets/landing-page/index.ts';

export default function StartersCard() {
    const judgesCard = (
        <div className={"red-welcome-card starters-card"}>
            <img src={bulbPlushie} className={"pixelated"} alt={"Bulbasaur"} id={"bulbasaur"}/>
            <img src={charPlushie} className={"pixelated"} alt={"Charmander"} id={"charmander"}/>
            <img src={squirtlePlushie} className={"pixelated"} alt={"Squirtle"} id={"squirtle"}/>
            <img src={pokeballSprite} className={"pixelated"} alt={"Pokeball"} id={"pokeball"}/>
        </div>);
    return (
        <GridItem component={judgesCard} row={1} column={1}/>
    );
};