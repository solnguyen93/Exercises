import React, { useState } from 'react';
import Box from './Box.js';
import NewBoxForm from './NewBoxForm';
import { v4 as uuid } from 'uuid';

function BoxList() {
    const INITIAL_STATE = [];

    const [boxes, setBoxes] = useState(INITIAL_STATE);

    const addBox = (newBox) => {
        setBoxes((boxes) => [...boxes, { ...newBox, id: uuid() }]);
    };

    const handleDelete = (boxId) => {
        setBoxes((boxes) => boxes.filter((box) => box.id !== boxId));
    };
    return (
        <div className="BoxList">
            <h3>Box List</h3>
            <NewBoxForm addBox={addBox} />
            <div className="BoxList-boxes">
                {boxes.map(({ id, width, height, backgroundColor }) => (
                    <Box key={id} width={width} height={height} backgroundColor={backgroundColor} onDelete={() => handleDelete(id)} />
                ))}
            </div>
        </div>
    );
}

export default BoxList;
