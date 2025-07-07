import FeatureWelcomeCard from "../../FeatureWelcomeCard/feature-welcome-card.tsx";
import GridItem from "../../../GridBox/GridItem/grid-item.tsx";

export default function VoteForTheWinner() {
    return (
        <GridItem
            component={<FeatureWelcomeCard paragraph={
                <p>
                    ¡<b>Vota</b> por el ganador!
                </p>
            }/>}
            row={3} column={2}/>
    );
}