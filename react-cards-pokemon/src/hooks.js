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

const useAxios = (url, formatter, additionalParams = '') => {
    const [data, setData] = useState([]);

    const addData = async () => {
        try {
            const response = await axios.get(`${url}${additionalParams}`);
            const formattedData = formatter ? formatter(response.data) : response.data;
            setData((prevData) => [...prevData, { ...formattedData, id: uuid() }]);
        } catch (error) {
            console.error('Error adding data:', error);
        }
    };

    return [data, addData];
};

// const useAxios = (url) => {
//     const [data, setData] = useState([]);

//     const addData = async (formatter = responseData => responseData, additionalParams = '') => {
//         try {
//             const response = await axios.get(`${url}${additionalParams}`);
//             const formattedData = formatter(response.data);
//             setData(prevData => [...prevData, { ...formattedData, id: uuid() }]);
//         } catch (error) {
//             console.error('Error adding data:', error);
//         }
//     };

//     return [data, addData];
// };

export { useFlip, useAxios };
