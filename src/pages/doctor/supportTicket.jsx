import React, { useEffect, useState } from 'react';
import { API_URL } from '../../service/config';
import { useNavigate } from 'react-router-dom';
import { get, post } from '../../service/axios';
import { toast } from 'react-toastify';
import { Socket } from '../../service/socket';

const SupportTicket = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [actionType, setActionType] = useState('');
    const [reason, setReason] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    const getTickets = async () => {
        await get(API_URL + '/getAllTicket').then((result) => {
            setTickets(result);
        }).catch((error) => {
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

    const openModal = (ticket, type) => {
        setSelectedTicket(ticket);
        setActionType(type);
        setIsModalOpen(true);
    };

    const handleSubmitResponse = async () => {
        await post(API_URL + "/doctor/sendResponse", {
            TicketId: selectedTicket._id,
            response: actionType,
            reply: reason
        }).then(() => {
            toast.success("Updated successfully!");
            setIsModalOpen(false);
            setReason('');
            getTickets();
        }).catch(() => {
            toast.error("cannot post result")
        })
    };
    return (
        <div className='bg-gradient-to-br from-gray-100 to-gray-300 h-screen w-screen font-serif'>
            <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
                <p className="text-3xl font-bold text-center text-gray-800">Support Ticket</p>
                <div className="flex justify-center pt-3">
                    <button
                        onClick={() => navigate("/doctor/profile")}
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
                                    <button onClick={() => navigate("/doctor/chat", { state: ticket })} className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
                                        Chat
                                    </button>
                                    <button onClick={() => openModal(ticket, "Accept")} className={`${buttonClasses} bg-green-200 hover:bg-green-700`}>
                                        Accept
                                    </button>
                                    <button onClick={() => openModal(ticket, "Reject")} className={`${buttonClasses} bg-red-200 hover:bg-red-700`}>
                                        Reject
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
                                    <button onClick={() => navigate("/doctor/chat", { state: ticket })} className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
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
                                    <button onClick={() => navigate("/doctor/chat", { state: ticket })} className={`${buttonClasses} bg-blue-200 hover:bg-blue-700`}>
                                        Chat
                                    </button>
                                </div>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
            {isModalOpen && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Provide Reason for {actionType}</h3>
                        <textarea
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="Enter reason here..."
                            className="w-full border border-gray-300 p-2 rounded-lg mb-4"
                        />
                        <div className="flex justify-end">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg mr-2 hover:bg-gray-300"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitResponse}
                                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SupportTicket;
