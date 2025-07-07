import './red-welcome-card.css'
import GridItem from "../../../GridBox/GridItem/grid-item.tsx";
import { judges } from '../../../../../assets/landing-page/index.ts'; 
export default function JudgesCard() {
    const judgesCard = (
        <div className={"red-welcome-card judges-card"}>
            <img src={judges} id={"judges-img"} alt={"Game Judges"}/>
        </div>);
    return (
        <GridItem component={judgesCard} row={3} column={1}/>
    );
}