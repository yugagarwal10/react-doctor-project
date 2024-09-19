import React, { useState ,useEffect} from 'react'
import "../showappointment.css"
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Showappointent = () => {
    const navigate = useNavigate();
    const appointment = (e) => {
        e.preventDefault();
        navigate("/Usermain")
    }
    const [info,setinfo]=useState([]);
    useEffect(() => {
        getdata()
    }, []);
    const getdata = async (event) => {
        const token=localStorage.getItem("token");
        const result = await axios.get("http://localhost:5000/appointmentList", { headers: { token: token } });
        setinfo(result.data);
    }
    console.log(info);
    
    return (
        <div>
            <body class="bg-gradient-to-br from-blue-50 to-blue-100 min-h-screen">


                <div class="min-h-screen flex flex-col items-center justify-center p-6">

                    <h1 class="text-5xl font-extrabold text-blue-700 mb-8 fade-in drop-shadow-lg">Your Booked Appointments</h1>

                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full fade-in">
                    {info.length > 0 ? (
                            info.map((user) => (
                                <div class="bg-white p-8 rounded-2xl shadow-lg transform hover:-translate-y-3 transition duration-300 hover-glow relative">
                            <div class="absolute -top-8 -left-8 bg-blue-500 rounded-full p-4">
                                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7-7-7m14-5l-7 7-7-7"></path></svg>
                            </div>
                            <h2 class="text-3xl font-bold text-gray-700 mb-4">Appointment with Dr. {user.doctorName}</h2>
                            <p class="text-gray-500 mb-2">Date: <span class="font-semibold">25th Sept, 2024</span></p>
                            <p class="text-gray-500 mb-2">Time: <span class="font-semibold">10:00 AM</span></p>
                            <p class="text-gray-500 mb-4">Location: XYZ Hospital</p>
                            <div class="flex space-x-4">
                                <button onclick="editAppointment('1')" class="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition duration-300">
                                    Edit
                                </button>
                                <button onclick="cancelAppointment('1')" class="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition duration-300">
                                    Cancel
                                </button>
                            </div>
                        </div>
                            ))
                        ) : (
                            <p value="No users found" disabled>No doctors found</p>
                        )}
                    </div>
                    <div class="mt-10 w-full flex justify-center space-x-4 fade-in">
                        <button class="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 hover-glow" onClick={appointment}>
                            Go to Main Page
                        </button>
                    </div>
                </div>

            </body>
        </div>
    )
}

export default Showappointent