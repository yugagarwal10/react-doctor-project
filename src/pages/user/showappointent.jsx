import React, { useState, useEffect } from 'react'
import "../../assets/showappointment.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify';
import { API_URL } from '../../service/config';
import { categorizeAppointments } from '../../common/data';
import { Getdata } from '../../common/data';

const Showappointent = () => {
    const navigate = useNavigate();
    const [info, setinfo] = useState([]);
    const token = localStorage.getItem("token");
    Getdata(setinfo, token)
    const HandleDelete = async (id) => {
        await axios.delete(API_URL + `/deleAppointment?id=${id}`, { headers: { authorization: token } })
            .then(() => {
                toast.success('deleted successfully!');
            })
            .catch((error) => {
                toast.error((Object.values(error.response.data).toString()))
            })
    }
    return (
        <div>
            <body class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen font-serif">


                <div class="min-h-screen flex flex-col items-center justify-center p-6">

                    <h1 class="text-5xl font-extrabold text-blue-700 mb-8 fade-in drop-shadow-lg">Your Booked Appointments</h1>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full fade-in">
                        {categorizeAppointments(info, 0).length > 0 ? (
                            categorizeAppointments(info, 0).map((user) => (
                                <div class="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-3 transition duration-300 hover-glow relative">
                                    <div class="absolute -top-8 -left-8 bg-blue-500 rounded-full p-4">
                                        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7-7-7m14-5l-7 7-7-7"></path></svg>
                                    </div>
                                    <h2 class="text-3xl font-bold text-gray-700 mb-4">Appointment with Dr. {user.doctorName}</h2>
                                    <p class="text-gray-500 mb-2">Date: <span class="font-semibold">{user.date}</span></p>
                                    <p class="text-gray-500 mb-2">Time: <span class="font-semibold">{user.time}</span></p>
                                    <p class="text-gray-500 mb-4">reason:{user.reason}</p>
                                    <div class="flex space-x-4">
                                        <button onClick={() => HandleDelete(user._id)} class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div class="mt-10 w-full flex justify-center space-x-4 fade-in">
                                <h2 class="text-3xl font-bold text-gray-700 mb-4">no details found</h2>
                            </div>
                        )}
                    </div>
                    <div class="mt-10 w-full flex justify-center space-x-4 fade-in">
                        <button
                            onClick={() => navigate("/user/main")}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                            Go to Main Profile
                        </button>
                    </div>
                </div>

            </body>
        </div>
    )
}

export default Showappointent