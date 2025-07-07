import GridBox from "../grid-box.tsx";
import ChoosePokemon from "./Cards/choose-pokemon.tsx";
import DressItUp from "./Cards/dress-it-up.tsx";
import VoteForTheWinner from "./Cards/vote-for-the-winner.tsx";
import JudgesCard from "./Cards/judges-card.tsx";
import PachirisuDawnCard from "./Cards/pachirisu-dawn-card.tsx";
import StartersCard from "./Cards/starters-card.tsx";

export default function WelcomeGridCards() {
    const cards = [
        <ChoosePokemon key="choose-pokemon" />,
        <DressItUp key="dress-it-up" />,
        <VoteForTheWinner key="vote-for-the-winner" />,
        <JudgesCard key="judges-card" />,
        <PachirisuDawnCard key="pachirisu-dawn-card" />,
        <StartersCard key="starters-card" />
    ];
    return (
        <GridBox items={cards}/>
    );
}