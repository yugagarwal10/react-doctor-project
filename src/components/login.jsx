import React, { useState } from 'react'
import { resolvePath, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import "../assets/App.css"
import { API_URL } from '../service/config';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { post } from '../service/axios';


const Login = () => {
  const { handleSubmit, register, formState: { errors } } = useForm()
  const [info, setinfo] = useState({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState(true);
  const togglePasswordVisibility = () => {
    if (showPassword === false) {
      setShowPassword(true)
    }
    else {
      setShowPassword(false)
    }
  }
  const handleInputChange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;
    setinfo((info) => ({
      ...info,
      [name]: value
    }));
  };  
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    await post(API_URL + "/userLogin", {email: info.email, password: info.password
    }).then((response) => { 
      localStorage.setItem("token", `bearer ` + response.token)
      localStorage.setItem("type", response.type);
      if (response.type === "doctor") {
        if (response.isverify === 1) {
          navigate("/doctor/profile")
        }
        else {
          navigate("/doctor/verify")
        }
      }
      if (response.type === "user") {
        if (response.isverify === 1) {
          navigate("/user/main")
        }
        else {
          navigate("/user/verify")
        }
      }
    })
      .catch((error) => {                
        toast.error(error)
      })
  }
  return (
    <div className="min-h-100vh  flex items-center justify-center bg-gradient-to-br from-purple-500 to-blue-600 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 p-10 bg-white shadow-2xl rounded-lg animate-fadeIn">
        <h2 className="text-center text-3xl font-extrabold text-gray-900">Login</h2>
        <form onSubmit={handleSubmit(handlesubmit)} className="space-y-6">
          <div className="rounded-md shadow-sm space-y-4">
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
                type={showPassword ? 'password' : 'text'}
                {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password must be at least 6 characters" } })}
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
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-6 border border-transparent rounded-md shadow-md text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transform hover:scale-105 transition-all duration-300 ease-in-out"
            >
              Login
            </button>
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Dont have an account?
            <span onClick={() => navigate("/")}
              className="text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
            >
              Register now
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login