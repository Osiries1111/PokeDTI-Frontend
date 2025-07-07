import React from "react";

export interface GridItemProps {
    component: React.ReactElement;
    row: number;
    column: number;
}

const GridItem: React.FC<GridItemProps> = ({component, row, column}) => {
    const gridItemStyle: React.CSSProperties = {
        gridRow: row,
        gridColumn: column,
    };

    return (
        <div style={gridItemStyle} className="grid-item">
            {component}
        </div>
    );
}

export default GridItem;