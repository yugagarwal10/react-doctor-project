import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { API_URL } from '../../service/config';
import { post } from '../../service/axios';
import { toast } from 'react-toastify';

const Applyticket = () => {
    const location = useLocation();
    const { handleSubmit, register, formState: { errors } } = useForm()
    const [info, setinfo] = useState({
        Reason: "",
        image: ""
    })
    const [ticket, setTicket] = useState({
        type: "",
        _id: "",

    });
    const ticketDetails = async () => {
        const details = await axios.get(API_URL + `/ticketDetails?ticket=${location.state}`)
        setTicket(details)
    }
    useEffect(() => {
        if (location.state) {
            ticketDetails();
        } else {
            toast.error("error ")
        }
    }, [])
    const navigate = useNavigate();
    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value,files,type } = event.target;
        if (type === 'file') {
            setinfo((info) => ({ ...info, [name]: files[0] }));
        } else {
            setinfo((info) => ({ ...info, [name]: value }));
        }
    };
    const applyTicket = async () => {
        const formdata = new FormData();
        formdata.append("image",info.image);
        const image = await post(API_URL + "/addTicketImage",formdata);  
        await post(API_URL + "/user/applyticket", {
            ticketId: ticket._id,
            title: ticket.type,
            reason: info.Reason,
            photo:image
        })
        .then(()=>{
            navigate("/user/main")
        }).catch((error) => {
            console.log("cannot set result")
        })
    }
    return (
        <div className="min-h-screen w-screen bg-white flex items-center justify-center p-6 relative">
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>

            <div className="relative bg-white rounded-2xl border border-gray-300 shadow-2xl p-12 w-full max-w-4xl transform transition duration-500 hover:scale-105 hover:shadow-xl">
                <h1 className="text-5xl font-extrabold mb-8 fade-in drop-shadow-lg text-center">Complain for {ticket.type}</h1>
                <form onSubmit={handleSubmit(applyTicket)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="full_name">Type</label>
                            <input type="text"
                                name="type" id="full_name" onChange={handleInputChange} className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105" value={ticket.type}></input>
                        </div>
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="email">Photo</label>
                            <input type="file"
                                onChange={handleInputChange} name="image" id="image" className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-105" ></input>
                        </div>
                    </div>

                    <div className="">
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="Reason">Reason</label>
                            <input type="text"
                                {...register("Reason", { pattern: { value: /^[a-zA-Z0-9 ]+$/, message: "Invalid Reason" } })} onChange={handleInputChange} name="Reason" id="Reason" className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-500 focus:outline-none focus:border-green-500 transition-all duration-300 hover:shadow-lg"></input>
                            {errors.Reason && <span className="text-red-500 text-sm">{errors.Reason.message}</span>}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="w-1/2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-110 hover:shadow-2xl">
                            Send Message
                        </button>
                    </div>
                    <div class="mt-10 w-full flex justify-center space-x-4 fade-in">
                        <button
                            onClick={() => navigate("/user/finddoctor")}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                            Go Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default Applyticket
