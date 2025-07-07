import React from "react";
import './grid-box.css';

function GridBox({ items }: {items: React.ReactElement[]}){
    return (
        <div className={"grid-box"}>
            {items}
        </div>
    );
}

export default GridBox;