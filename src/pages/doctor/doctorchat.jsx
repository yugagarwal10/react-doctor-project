import React, { useState, useEffect } from 'react'
import { Socket } from '../../service/socket';

const Doctorchat = () => {
    const [message, usermessage] = useState({
        message: "",
    });
    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        usermessage((info) => ({
            ...info,
            [name]: value
        }));
    };
    const Allmessage = document.querySelector(".message");
    useEffect(() => {
        Socket.on("user-message", (message) => {
            const p = document.createElement("p");
            p.innerText = message;
            Allmessage.appendChild(p);
        })
    })
    const handlemessage = () => {
        Socket.emit("doctor-message", message.message);
        const p = document.createElement("p");
        p.innerText = message.message;
        Allmessage.appendChild(p);
        document.querySelector(".input").value = "";
    }
    return (
        <div>
            <div class="flex flex-col h-screen w-screen bg-gray-100">
                <div class="flex-1 p-4 overflow-y-auto">
                    <div class="message space-y-4 x-2">
                    </div>
                </div>
                <div class="bg-white p-4 flex items-center border-t border-gray-300">
                    <input onChange={handleInputChange} name='message'
                        type="text"
                        class="input flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type your message..."
                    />
                    <button onClick={handlemessage} class="ml-3 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Send
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Doctorchat
