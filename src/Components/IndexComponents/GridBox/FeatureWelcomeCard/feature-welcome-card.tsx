import React from "react";
import './feature-welcome-card.css'

export default function FeatureWelcomeCard( {paragraph}: {paragraph: React.ReactElement}){
    return (
        <div className={"feature-welcome-card"}>
            {paragraph}
        </div>
    );
}