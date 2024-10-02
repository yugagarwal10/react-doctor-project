import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faClock, faClipboardList } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../../service/config';

const Appointmentcompleted = () => {
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
    const result = await axios.get(API_URL+"/appointmentList", { headers: { token: token, status: 1 } });
    setInfo(result.data);
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6 font-serif">
      <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <p className="text-3xl font-bold text-center text-gray-800 font-serif">Doctor Dashboard</p>
      </nav>

      <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800 animate-bounce">Completed Appointments</h2>

      <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {info.length > 0 ? (
          info.map((user) => (
            <div key={user.id} className="bg-white rounded-lg shadow-lg p-6 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 border-l-4 border-green-500">
              <div className="flex items-center mb-4">
                <FontAwesomeIcon icon={faUser} className="text-green-500 text-3xl mr-3" />
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
          ))
        ) : (
          <div className="mt-10 w-full flex justify-center space-x-4">
            <h2 className="text-3xl font-bold text-gray-700 mb-4">No details found</h2>
          </div>
        )}
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/doctor/profile")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
        >
          Go to Main Profile
        </button>
      </div>
    </div>
  );
};

export default Appointmentcompleted;
