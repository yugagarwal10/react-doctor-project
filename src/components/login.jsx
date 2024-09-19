import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import "../App.css"
const Login = () => {
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
  const handleSubmit = async (e) => {
    e.preventDefault();
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
      if(type == "user") {
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
    <div className="wrapper">
      <h2>LOGIN</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input type="text" placeholder="Enter your email" name='email' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box">
          <input type="password" placeholder="Enter password" name='password' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box button">
          <input type="Submit"></input> <ToastContainer />
        </div>
      </form>
    </div>
  )
}

export default Login