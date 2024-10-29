import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClock, faClipboardList, faCheckCircle, faTimesCircle, faHourglassHalf, faTrash } from '@fortawesome/free-solid-svg-icons';
import { categorizeAppointments, Getdata } from '../../common/data';
import { useDispatch, useSelector } from 'react-redux';

const Medicalrecords = () => {
  const navigate = useNavigate();
  const dispatch=useDispatch();
  useEffect(() => {
    Getdata(dispatch);
}, [dispatch]);
const info=useSelector(state=>state.appointment.list);

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-100 min-h-screen p-6 font-serif">
      <nav className="bg-white shadow-lg rounded-lg p-4 mb-8">
        <p className="text-3xl font-bold text-center text-gray-800">User Dashboard</p>
        <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/user/main")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
        >
          Go to Main Profile
        </button>
        </div>
      </nav>

      <h2 className="text-4xl font-semibold text-center mb-6 text-gray-800">Appointments</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-yellow-600">Pending Appointments</h3>
          <div className="space-y-6">
            {categorizeAppointments(info, 0).map((user) => (
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
            {categorizeAppointments(info, 1).map((user) => (
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
            {categorizeAppointments(info, 2).map((user) => (
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
            {categorizeAppointments(info, 3).map((user) => (
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
    </div>
  );
};

export default Medicalrecords;
