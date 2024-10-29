import React, { useEffect } from 'react';
import { toast } from 'react-toastify';
import { Socket } from '../service/socket';

const Common = ({ children }) => {
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

    return <div>{children}</div>;
};

export default Common
