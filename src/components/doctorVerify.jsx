import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { API_URL } from '../service/config';

const Doctor = () => {
  const { handleSubmit, register, formState: { errors } } = useForm();
  const [info, setInfo] = useState({
    image: "",
    expertise: [],
    startShiftTime: "",
    endShiftTime: "",
    qualification: "",
    about: "",
  });
  const navigate = useNavigate();

  const handleInputChange = (event) => {
    const { name, value, type, files } = event.target;
    if (type === 'file') {
      setInfo((info) => ({ ...info, [name]: files[0] }));
    } else if (type === 'select-multiple') {
      const selectedOptions = [...event.target.selectedOptions].map(option => option.value);
      setInfo((info) => ({ ...info, [name]: selectedOptions }));
    } else {
      setInfo((info) => ({ ...info, [name]: value }));
    }
  };
  const token = localStorage.getItem("token");
  
  useEffect(() => {
    if (!token) {
      navigate("/Login")
    }
  }, [token]);

  const handlesubmit = async (event) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("image", info.image);
      formData.append("expertise", info.expertise);
      formData.append("startShiftTime", info.startShiftTime);
      formData.append("endShiftTime", info.endShiftTime);
      formData.append("qualification", info.qualification);
      formData.append("about", info.about);   
      const response = await axios.post(API_URL+"/addDoctorDetails", formData ,{
        headers: { token: token },
        'Content-Type': 'multipart/form-data',
      })
      console.log('Details uploaded successfully', response.data);
      navigate("/Doctorprofile");
      toast.success('Details uploaded successfully!');
    } catch (error) {
      toast.error(Object.values(error.response.data).toString());
      console.error('Error submitting the form', Object.values(error.response.data).toString());
    }
  };

  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 via-purple-200 to-purple-500 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6 animate-bounceIn">Doctor Details</h2>
        <form onSubmit={handleSubmit(handlesubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Degree</label>
            <input type="file"
              {...register("degree", { required: "degree is required" })}
              name="image"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.degree && <span className="text-red-500 text-sm">{errors.degree.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Expertise</label>
            <select name="expertise"
              {...register("expertise", { required: "Expertise is required" })}
              onChange={handleInputChange}
              multiple
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105">
              <option value="Immunologists">Immunologists</option>
              <option value="Anesthesiologists">Anesthesiologists</option>
              <option value="Cardiologists">Cardiologists</option>
              <option value="Colon and Rectal Surgeons">Colon and Rectal Surgeons</option>
              <option value="Dermatologists">Dermatologists</option>
              <option value="Endocrinologists">Endocrinologists</option>
              <option value="Gastroenterologists">Gastroenterologists</option>
            </select>
            {errors.expertise && <span className="text-red-500 text-sm">{errors.expertise.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Start Shift Time</label>
            <input type="time"
              {...register("startShiftTime", { required: "Start Shift Time is required" })}
              name="startShiftTime"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.startShiftTime && <span className="text-red-500 text-sm">{errors.startShiftTime.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">End Shift Time</label>
            <input type="time"
              {...register("endShiftTime", { required: "End Shift Time is required" })}
              name="endShiftTime"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.endShiftTime && <span className="text-red-500 text-sm">{errors.endShiftTime.message}</span>}
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Qualification</label>
            <input type="text"
              {...register("qualification", { required: "Qualification is required", pattern: { value: /^[a-zA-Z ]+$/, message: "Invalid qualification" } })}
              name="qualification"
              placeholder="Enter qualifications"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.qualification && <span className="text-red-500 text-sm">{errors.qualification.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">About</label>
            <input type="text"
              {...register("about", { required: "About is required", pattern: { value: /^[a-zA-Z ]+$/, message: "Invalid about" } })}
              name="about"
              placeholder="Tell something about yourself"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.about && <span className="text-red-500 text-sm">{errors.about.message}</span>}
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              Submit
            </button>
          </div>
        </form>
      </div>
      <style>{`
        .animate-fadeIn {
          animation: fadeIn 0.8s ease-in-out;
        }
        .animate-bounceIn {
          animation: bounceIn 0.8s ease-in-out;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes bounceIn {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.05);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}

export default Doctor;
