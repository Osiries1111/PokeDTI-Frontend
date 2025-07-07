import FeatureWelcomeCard from "../../FeatureWelcomeCard/feature-welcome-card.tsx";
import GridItem from "../../../GridBox/GridItem/grid-item.tsx";

export default function DressItUp(){
    return (
        <GridItem
            component={<FeatureWelcomeCard paragraph={
                <p>
                    <b>Vístelo</b> según la temática
                </p>
            }/>}
            row={2} column={1}/>
    );
}