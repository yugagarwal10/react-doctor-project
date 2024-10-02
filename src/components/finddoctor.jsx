import { React, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "../assets/showappointment.css";
import axios from 'axios';
import { API_URL } from '../service/config';

const Finddoctor = () => {
  const [list, setlist] = useState([]);
  const navigate = useNavigate();

  const getdata = async () => {
    try {
      const result = await axios.get(API_URL+"/doctorList");
      setlist(result.data);
    } catch (error) {
      toast.error('Failed to fetch doctor data');
    }
  };
  const token=localStorage.getItem("token");
  useEffect(() => {
    if (!token) {
        navigate("/Login")
    }
    else {
      getdata()
    }
}, []);

  return (
    <div>
      <body className="bg-gray-100 font-serif">
        <div className="container mx-auto py-10">
          <div className="flex justify-end mb-6">
          <button
          onClick={() => navigate("/Usermain")}
          className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
        >
          Go to Main Profile
        </button>
          </div>

          <h1 className="text-4xl font-bold text-center mb-10">Our Doctors</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {list.length > 0 ? (
              list.map((user) => (
                <div  
                  className="bg-white rounded-lg overflow-hidden shadow-lg transition-all duration-300 ease-in-out transform card-hover"
                >
                  <img 
                    src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQoaTnj2VuwfHPqvefk025J8uVhz1UfYtYWug&s" 
                    alt="Doctor Image" 
                    className="w-full h-52 object-cover card-img transition-transform duration-300 mt-8"
                  />
                  <div className="p-2 py-6">
                    <h2 className="text-2xl font-bold mb-2 break-words">{user.fullName}</h2>
                    <div className="mt-4 mb-2">
                      <p><span className="font-semibold p-2 mb-2 break-words">Email:</span>{user.email}</p>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="mt-10 w-full flex justify-center space-x-4 fade-in">
                <h2 className="text-3xl font-bold text-gray-700 mb-4">No details found</h2>
              </div>
            )}
          </div>
        </div>
      </body>
    </div>
  );
};

export default Finddoctor;
