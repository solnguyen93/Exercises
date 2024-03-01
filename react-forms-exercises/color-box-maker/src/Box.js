import React from 'react';

function Box({ width, height, backgroundColor, onDelete }) {
    const boxStyle = {
        width: `${width}em`,
        height: `${height}em`,
        backgroundColor: backgroundColor,
    };

    return (
        <div className="Box">
            <div className="Box-content" style={boxStyle}></div>
            <button className="Box-delete-button" onClick={onDelete}>
                X
            </button>
        </div>
    );
}

export default Box;
