import GridItem from "../../../GridBox/GridItem/grid-item.tsx";
import FeatureWelcomeCard from "../../FeatureWelcomeCard/feature-welcome-card.tsx";

export default function ChoosePokemon(){
    return (
        <GridItem
            component={<FeatureWelcomeCard paragraph={
                <p>
                    <b>Elige</b> a tu pokemon favorito
                </p>
            }/>}
            row={1} column={2}/>
    );
}