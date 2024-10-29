import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { API_URL } from '../../service/config';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../service/axios';
import { toast } from 'react-toastify';

const UserTickets = () => {
    const [tickets, setTickets] = useState([]);
    const navigate = useNavigate();

    const getTickets = async () => {
        await get(API_URL + `/getUserAllTicket?id=${localStorage.getItem("id")}`).then((result)=>{
            setTickets(result);
        }).catch((error)=>{
            toast.error("cannot get details")
        })
    };
    useEffect(() => {
        getTickets();
    }, []);

    const categorizedTickets = (status) => {
        return tickets.filter((ticket) => ticket.status === status);
    };

    const buttonClasses = 'text-black text-bold text-center px-4 py-3 rounded-lg transition-all duration-300 transform hover:scale-105 hover:text-white shadow-md';
    return (
        <div className='bg-gradient-to-br from-gray-100 to-gray-300 h-screen w-screen font-serif'>
            <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
                <p className="text-3xl font-bold text-center text-gray-800">Support Ticket</p>
                <div className="flex justify-center pt-3">
                    <button
                        onClick={() => navigate("/user/main")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                    >
                        Go to Main Profile
                    </button>
                </div>
            </nav>
            <div className="container mx-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-yellow-800">Pending Tickets</h2>
                        {categorizedTickets(0).map((ticket) => (
                            <div key={ticket.id} className="bg-white border border-yellow-300 shadow-lg rounded-lg p-4 mb-4 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
                                <div className="justify-between items-center">
                                    <div className='text-center'>
                                        <h1 className="text-xl font-bold text-center">{ticket.title}</h1>
                                        <h4 className="text-small mt-2 text-gray-600">Email: {ticket.email}</h4>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">Reason: {ticket.reason}</p>
                                <div className="mt-4 flex text-center justify-around">
                                    <button onClick={()=>navigate("/user/chat",{state:ticket})}className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-green-800">Accepted Tickets</h2>
                        {categorizedTickets(1).map((ticket) => (
                            <div key={ticket.id} className="bg-white border border-green-300 shadow-lg rounded-lg p-4 mb-4 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
                                <div className="justify-between items-center">
                                    <div className='text-center'>
                                        <h1 className="text-xl font-bold">{ticket.title}</h1>
                                        <h4 className="text-small mt-2 text-gray-600">Email: {ticket.email}</h4>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">Reason: {ticket.reason}</p>
                                <p className="mt-2 text-gray-700">Response: {ticket.response}</p>
                                <div className="mt-1 flex text-center justify-around">
                                    <button onClick={()=>navigate("/user/chat",{state:ticket})}className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                    <section>
                        <h2 className="text-3xl font-bold mb-4 text-red-800">Rejected Tickets</h2>
                        {categorizedTickets(2).map((ticket) => (
                            <div key={ticket.id} className="bg-white border border-red-300 shadow-lg rounded-lg p-4 mb-4 hover:shadow-2xl transition-transform transform hover:scale-105 duration-300">
                                <div className="justify-between items-center">
                                    <div className='text-center'>
                                        <h3 className="text-xl font-bold">{ticket.title}</h3>
                                        <h4 className="text-small mt-2 text-gray-600">Email: {ticket.email}</h4>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-700">Reason: {ticket.reason}</p>
                                <p className="mt-2 text-gray-700">response: {ticket.response}</p>
                                <div className="mt-1 flex text-center justify-around">
                                    <button onClick={()=>navigate("/user/chat",{state:ticket})}className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </div>
    );
};

export default UserTickets;
