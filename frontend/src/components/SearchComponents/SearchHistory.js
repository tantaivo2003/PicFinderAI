import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const SearchHistory = ({ userId }) => {
    const navigate = useNavigate();
    const [histories, setHistories] = useState([]);

    useEffect(() => {
        const fetchSearchHistory = async (userId) => {
            try {
                const response = await fetch(`${process.env.REACT_APP_API_URL}/history/${userId}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setHistories(data);
            } catch (error) {
                console.error('Error fetching search history:', error);
            }
        };
        fetchSearchHistory(userId);
    }, [userId]);

    const deleteSearchHistory = async (historyId) => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/history/${historyId}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            await response.json();
            setHistories(histories.filter(history => history.id !== historyId));
        } catch (error) {
            console.error('Error deleting search history:', error);
        }
    };

    // const deleteAllSearchHistory = async (userId) => {
    //     try {
    //         const response = await fetch(`${process.env.REACT_APP_API_URL}/history/user/${userId}`, {
    //             method: 'DELETE',
    //         });
    //         if (!response.ok) {
    //             throw new Error(`HTTP error! status: ${response.status}`);
    //         }
    //         const data = await response.json();
    //         console.log(data.message); // "All search history for user deleted successfully"
    //         // Clear the history list after deletion
    //         setHistories([]);
    //     } catch (error) {
    //         console.error('Error deleting all search history for user:', error);
    //     }
    // };

    return (
        <div className="bg-white rounded-lg">
            <ul className="font-medium text-black text-left text-lg cursor-pointer my-3">
                {histories.map((history, index) => (
                    <li key={index} className="p-4 hover:bg-gray-200 rounded-lg flex items-center justify-between">
                        <svg className="w-5 h-5 md:w-8 md:h-8 mr-3" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" fill="#3D3D3D" viewBox="0 0 72 72">
                            <path d="M 31 11 C 19.973 11 11 19.973 11 31 C 11 42.027 19.973 51 31 51 C 34.974166 51 38.672385 49.821569 41.789062 47.814453 L 54.726562 60.751953 C 56.390563 62.415953 59.088953 62.415953 60.751953 60.751953 C 62.415953 59.087953 62.415953 56.390563 60.751953 54.726562 L 47.814453 41.789062 C 49.821569 38.672385 51 34.974166 51 31 C 51 19.973 42.027 11 31 11 z M 31 19 C 37.616 19 43 24.384 43 31 C 43 37.616 37.616 43 31 43 C 24.384 43 19 37.616 19 31 C 19 24.384 24.384 19 31 19 z"></path>
                        </svg>
                        <span onClick={() => navigate(`/search/${history.search_term}`)} className="w-11/12">{history.search_term}</span>
                        <svg
                            className="w-4 h-4 text-red-600 hover:text-red-800 cursor-pointer"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            onClick={() => deleteSearchHistory(history.id)}
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default SearchHistory;
