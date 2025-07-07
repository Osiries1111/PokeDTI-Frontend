import React from "react";
import "./ribbon-box.css";
import { ribbons } from "../../../../assets/perfil-page/ribbons";
import type { RibbonClass } from "../../../../Components/ProfileComponents/ribbon-types";

interface RibbonBoxProps {

    // adquiredRibbons: array of tuples with ribbon name and index
    adquiredRibbons: Array<[RibbonClass, number]>;
}

const RibbonBox: React.FC<RibbonBoxProps> = ({ adquiredRibbons }) => {
    return (
        <div className="ribbon-box">
            {adquiredRibbons.map(([ribbonName, ribbonIndex]) => {
                const ribbonImage = ribbons[ribbonName][ribbonIndex];
                return (
                    <div className="ribbon-item" key={`${ribbonName}-${ribbonIndex}`}>
                        <img src={ribbonImage} alt={ribbonName} />
                    </div>
                );
            })}
        </div>
    );
};

export default RibbonBox;