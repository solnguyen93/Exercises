import { useState } from 'react';
import axios from 'axios';
import { v4 as uuid } from 'uuid';

const useFlip = (initialState = true) => {
    const [isFacingUp, setIsFacingUp] = useState(initialState);
    const flipCard = () => {
        setIsFacingUp((isUp) => !isUp);
    };
    return [isFacingUp, flipCard];
};

const useAxios = (url) => {
    const [data, setData] = useState([]);

    const addData = async (additionalParams = '') => {
        try {
            const queryParams = typeof additionalParams === 'string' ? additionalParams : '';
            const response = await axios.get(`${url}${queryParams}`);
            setData((prevData) => [...prevData, { ...response.data, id: uuid() }]);
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    return [data, addData];
};

export { useFlip, useAxios };
