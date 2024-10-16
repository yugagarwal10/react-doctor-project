import { React, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../../service/config';
import { get } from '../../service/axios';
import { Getdata, Logout } from '../../common/data';
import axios from 'axios';

const DoctorProfile = () => {
    const navigate = useNavigate();
    const [info, setInfo] = useState({
        fullName: "",
        expertise: [],
        email: "",
        qualification: "",
        about: "",
        image: "",
    });
    const token = localStorage.getItem("token");
    const getData = async () => {
        const result = await axios.get(API_URL + "/doctorDetails", { headers: { authorization: token } });
        setInfo(result);
    };
    Getdata();
    useEffect(() => {
        getData()
    }, []);

    const logout=()=>{
        Logout("/doctorLogout")
        navigate("/Login")
    }
    return (
        <div className="bg-gradient-to-br from-indigo-200 to-blue-100 min-h-screen p-8 font-serif">
            <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Doctor Profile</h1>
                    <div className="flex space-x-6">
                        <button onClick={logout} className="logout-btn">
                            <i className="fas fa-sign-out-alt"></i> Log Out
                        </button>
                    </div>
                </div>
            </nav>

            <div className="bg-white rounded-lg shadow-xl p-6 flex flex-col md:flex-row mb-8 transform transition-transform hover:scale-105 hover:shadow-2xl duration-300">
                <div className="md:w-1/3 text-center">
                    <img
                        src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg"
                        alt="Doctor"
                        className="rounded-full w-40 h-40 mx-auto border-4 border-indigo-500 shadow-lg"
                    />
                </div>
                <div className="md:w-2/3 md:pl-6">
                    <h2 className="text-4xl font-semibold text-gray-800">{info.fullName.toUpperCase()}</h2>
                    <p className="mt-2 text-gray-600">
                        <strong className="text-indigo-600">Specialty:</strong> {info.expertise?.length > 0 ? info.expertise.join(', ') : 'Not specified'}
                    </p>
                    <p className="mt-2 text-gray-600"><strong className="text-indigo-600">Qualification:</strong> {info.qualification}</p>
                    <p className="mt-2 text-gray-600"><strong className="text-indigo-600">Contact:</strong> {info.email}</p>
                </div>
            </div>

            <div className="flex justify-center space-x-4 mb-8">
                <button onClick={() => navigate("/doctor/appointmentpending")}
                    className="bg-gradient-to-r from-blue-500 to-teal-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-teal-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-clock"></i> Pending Appointments
                </button>
                <button onClick={() => navigate("/doctor/appointmentcompleted")}
                    className="bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-green-600 hover:to-lime-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-check"></i> Completed Appointments
                </button>
                <button onClick={() => navigate("/doctor/allappointment")}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-list"></i> All Appointments
                </button>
                <button onClick={() => navigate("/doctor/profileupdate")}
                    className="bg-gradient-to-r from-green-500 to-lime-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-green-600 hover:to-lime-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-list"></i> Update Profile
                </button>
                <button onClick={() => navigate("/doctor/chat")}
                    className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-teal-600 hover:to-cyan-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-list"></i> Chat
                </button>
            </div>

            <div className="bg-white rounded-lg shadow-xl p-6 transition duration-300 transform hover:scale-105 mb-8">
                <h4 className="text-xl font-bold mb-2 text-indigo-600">Doctor's Experience</h4>
                <p className="text-gray-600">{info.about || 'No information available.'}</p>
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    0% { opacity: 0; }
                    100% { opacity: 1; }
                }
                .animate-fadeIn {
                    animation: fadeIn 0.5s ease-in-out forwards;
                }
            `}</style>
        </div>
    );
};

export default DoctorProfile;
