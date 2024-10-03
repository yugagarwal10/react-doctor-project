import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { API_URL } from '../service/config';

const Register = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [info, setinfo] = useState({
    fullName: '',
    email: '',
    password: '',
    type: '',
  });
  const [showPassword, setShowPassword] = useState(false); 

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setinfo((info) => ({
      ...info,
      [name]: value,
    }));
  };

  const togglePasswordVisibility = () => {
    if(showPassword===true){
      setShowPassword(false)
    }
    else{
      setShowPassword(true)
    }
  };

  const navigate = useNavigate();

  const handlesubmit = async (e) => {
    try {
      const response = await axios.post(API_URL+'/userRegister', {
        fullName: info.fullName,
        email: info.email,
        password: info.password,
        type: info.type,
      });
      console.log('User saved:', response.data);
      toast.success('User registered successfully!');
      navigate('/login');
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()));
      console.error('Error submitting the form', (Object.values(error.response.data).toString()));
    }
  };

  const redirect = (e) => {
    e.preventDefault();
    navigate('/login');
  };

  return (
    <div className="min-h-100vh flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-2xl rounded-lg animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Register</h2>
        <form onSubmit={handleSubmit(handlesubmit)} className="space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
            <div className="relative">
              <input
                type="text"
                {...register("fullName", { required: "Full Name is required", pattern: { value: /^[a-zA-Z ]+$/, message: "Full Name is not valid" } })}
                name="fullName"
                onChange={handleInputChange}
                className="appearance-none rounded-md w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Full Name"
              />
              {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
            </div>
            <div className="relative">
              <input
                type="email"
                {...register("email", { required: "Email is required", pattern: { value: /^\S+@\S+$/i, message: "Email is not valid" } })}
                onChange={handleInputChange}
                className="appearance-none rounded-md w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Email"
              />
              {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'} 
                {...register("password", { required: "Password is required", minLength: { value: 6, message: "Password must be at least 6 characters" } })}
                name="password"
                onChange={handleInputChange}
                className="appearance-none rounded-md w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
              />
              <span
                className="absolute inset-y-0 right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} className="text-gray-600" />
              </span>
              {errors.password && <span className="text-red-500">{errors.password.message}</span>}
            </div>
            <div className="relative">
              <input
                type="text"
                {...register("type", { required: "Type is required" })}
                name="type"
                onChange={handleInputChange}
                className="appearance-none rounded-md w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Type"
              />
              {errors.type && <span className="text-red-500">{errors.type.message}</span>}
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Register
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?
            <span
              onClick={redirect}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Login now
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
