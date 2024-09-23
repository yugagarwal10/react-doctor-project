import { React, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Appointmentpending = () => {
  const navigate = useNavigate();
  const [info, setInfo] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const token = localStorage.getItem("token");
    const result = await axios.get("http://localhost:5000/appointmentList", { headers: { token: token, status: 0 } });
    setInfo(result.data);
  };

  return (
    <div className="bg-gradient-to-br from-purple-200 to-blue-200 min-h-screen p-6 font-serif">
      <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <p className="text-2xl font-bold text-center text-gray-800 animate-pulse">Doctor Dashboard</p>
      </nav>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8 transition-transform transform hover:scale-105 duration-300">
        <h2 className="text-4xl font-bold text-center text-purple-600 mb-2">Upcoming Appointments</h2>
        <p className="text-center text-gray-600">Manage your patients effectively!</p>
      </div>

      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {info.length > 0 ? (
            info.map((user) => (
              <div
                key={user.id}
                className="bg-white rounded-lg shadow-lg p-8 transition-transform transform hover:scale-105 hover:shadow-2xl duration-300 border-l-4 border-purple-500"
              >
                <h5 className="text-2xl font-bold text-gray-800">{user.userName}</h5>
                <p className="text-lg font-semibold text-gray-800">{user.time}, {user.date}</p>
                <p className="text-gray-600 mb-4">Reason: {user.reason}</p>
                <div className="flex justify-center mt-4 space-x-4">
                  <button className="bg-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-check mr-1"></i> Accept
                  </button>
                  <button className="bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition duration-300 transform hover:scale-105">
                    <i className="fas fa-exclamation-circle mr-1"></i> Reject
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="mt-10 w-full flex justify-center space-x-4">
              <h2 className="text-3xl font-bold text-gray-700 mb-4">No details found</h2>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button
          onClick={() => navigate("/Doctorprofile")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
        >
          Go to Main Profile
        </button>
      </div>
    </div>
  );
};

export default Appointmentpending;
