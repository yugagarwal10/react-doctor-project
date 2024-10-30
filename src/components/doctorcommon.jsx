import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Socket } from '../service/socket';

const DoctorCommon = ({ children }) => {
    const id = localStorage.getItem("id"); 
    const handleChatMessage = (message) => {
        toast.info(`new incoming message from ${message}`);
    };
    useEffect(() => {
        Socket.on(`message ${id}`, handleChatMessage);
        return () => {
            Socket.off(`message ${id}`, handleChatMessage);
        };
    }, []);

    return <div>{children}</div>;
};

export default DoctorCommon
