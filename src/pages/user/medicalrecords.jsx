import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faClipboardList, faCheckCircle, faTimesCircle, faHourglassHalf, faTrash } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../service/config';

const Medicalrecords = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/Login")
    }
    else {
      getData()
    }
  }, []);
  const getData = async () => {
    const result = await axios.get(API_URL+"/fullAppointmentList", { headers: { token: token } });
    setInfo(result.data);
  };

  const categorizeAppointments = (status) => {
    return info.filter((user) => user.status === status);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6 font-serif">
      <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <p className="text-3xl font-bold text-center text-gray-800">User Dashboard</p>
      </nav>

      <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">Appointments</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-yellow-600">Pending Appointments</h3>
          <div className="space-y-6">
            {categorizeAppointments(0).map((user) => (
              <div key={user.id} className="bg-yellow-50 rounded-lg shadow-lg p-6 mt-5 border-l-4 border-yellow-500 transition-transform hover:scale-105 duration-300 animate-bounce">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faHourglassHalf} className="text-yellow-500 text-3xl mr-3" />
                  <h5 className="text-2xl font-bold text-gray-800">{user.userName}</h5>
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                  <p className="text-lg font-semibold text-gray-800">{user.time}, {user.date}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-gray-600 mr-2" />
                  <p className="text-gray-600">Reason: {user.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-green-600">Completed Appointments</h3>
          <div className="space-y-6">
            {categorizeAppointments(1).map((user) => (
              <div key={user.id} className="bg-green-50 rounded-lg shadow-lg p-6 border-l-4 border-green-500 transition-transform hover:scale-105 hover:shadow-2xl duration-300">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faCheckCircle} className="text-green-500 text-3xl mr-3" />
                  <h5 className="text-2xl font-bold text-gray-800">{user.userName}</h5>
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                  <p className="text-lg font-semibold text-gray-800">{user.time}, {user.date}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-gray-600 mr-2" />
                  <p className="text-gray-600">Reason: {user.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-red-600">Rejected Appointments</h3>
          <div className="space-y-6">
            {categorizeAppointments(2).map((user) => (
              <div key={user.id} className="bg-red-50 rounded-lg shadow-lg p-6 border-l-4 border-red-500 transition-transform hover:scale-105 duration-300 animate-shake">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faTimesCircle} className="text-red-500 text-3xl mr-3" />
                  <h5 className="text-2xl font-bold text-gray-800">{user.userName}</h5>
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                  <p className="text-lg font-semibold text-gray-800">{user.time}, {user.date}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-gray-600 mr-2" />
                  <p className="text-gray-600">Reason: {user.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-gray-600">Deleted Appointments</h3>
          <div className="space-y-6">
            {categorizeAppointments(3).map((user) => (
              <div key={user.id} className="bg-gray-50 rounded-lg shadow-lg p-6 border-l-4 border-gray-500 transition-transform hover:scale-105 duration-300">
                <div className="flex items-center mb-4">
                  <FontAwesomeIcon icon={faTrash} className="text-gray-500 text-3xl mr-3" />
                  <h5 className="text-2xl font-bold text-gray-800">{user.userName}</h5>
                </div>
                <div className="flex items-center mb-2">
                  <FontAwesomeIcon icon={faClock} className="text-gray-600 mr-2" />
                  <p className="text-lg font-semibold text-gray-800">{user.time}, {user.date}</p>
                </div>
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faClipboardList} className="text-gray-600 mr-2" />
                  <p className="text-gray-600">Reason: {user.reason}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/user/main")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
        >
          Go to Main Profile
        </button>
      </div>
    </div>
  );
};

export default Medicalrecords;
