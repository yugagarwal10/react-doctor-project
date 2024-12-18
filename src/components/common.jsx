import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Socket } from '../service/socket';

const Common = ({ children }) => {
    const id = localStorage.getItem("id"); 
    const handleMessage = (message) => {
        toast.info(`Doctor has ${message}ed your appointment`);
    };
    useEffect(() => {
        const id = localStorage.getItem("id");
        Socket.on(`response ${id}`, handleMessage);
        return () => {
            Socket.off(`response ${id}`, handleMessage);
        };
    }, []);
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

export default Common
