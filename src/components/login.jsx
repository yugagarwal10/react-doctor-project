import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import "../App.css"
const Login = () => {
  const { handleSubmit, register, formState: { errors } } = useForm()
  const [info, setinfo] = useState({
    email: "",
    password: ""
  });
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
    try {
      const response = await axios.post("http://localhost:5000/userLogin", {
        email: info.email,
        password: info.password
      });
      const data = await decryptData(response.data.mac, response.data.value)
      console.log('login successfully:', response);
      toast.success('User login successfully!');
      localStorage.setItem("token", data.data.token)
      const type = data.data.type;
      const Doctorstatus = data.data.status;
      const userStatus = data.data.status;

      if (type == "doctor") {
        if (Doctorstatus == 1) {
          navigate("/Doctorprofile")
        }
        else {
          navigate("/Doctor")
        }
      }
      if (type == "user") {
        if (userStatus == 1) {
          navigate("/Usermain")
        }
        else {
          navigate("/Userverify")
        }
      }
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()))
      console.error('Error submitting the form', (Object.values(error.response.data).toString()));
    }
  }
  const decryptData = async (mac, value) => {
    try {
      const response = await axios.post("http://localhost:5000/DecryptData", { mac, value });
      return response
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };
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
                type="password"
                {...register("password", { required: "Password is required", minLength: { value: 5, message: "Password must be at least 6 characters" } })}
                name="password"
                onChange={handleInputChange}
                className="appearance-none rounded-md w-full py-3 px-4 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Password"
              />
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
            <ToastContainer />
          </div>
        </form>
        <div className="text-center mt-6">
          <p className="text-gray-600">Dont have an account?
            <span onClick={()=>navigate("/")}
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