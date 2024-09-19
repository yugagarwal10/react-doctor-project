import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import "../App.css"

const Register = () => {
  const [info, setinfo] = useState({
    fullName: "",
    email: "",
    password: "",
    type: "",
  });
  // useEffect(() => {
  //   const token = localStorage.getItem("token");
  //   if (token) {
  //     navigate("/mainpage")
  //   }
  // })
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
      const response = await axios.post("http://localhost:5000/userRegister", {
        fullName: info.fullName,
        email: info.email,
        password: info.password,
        type: info.type
      });
      console.log('User saved:', response.data);
      toast.success('User register successfully!');
      navigate("/login");
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()))
      console.error('Error submitting the form', (Object.values(error.response.data).toString()));
    }
  }
  const redirect = (e) => {
    e.preventDefault();
    navigate("/login");
  }
  return (
    <div className="wrapper">
      <h2>Registration</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input type="text" placeholder="Enter your name" name='fullName' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Enter your email" name='email' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Enter password" name='password' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Enter type" name='type' onChange={handleInputChange} ></input>
        </div>
        <div className="input-box button">
          <input type="Submit"></input> <ToastContainer />
        </div>
        <div className="text">
          <h3 onClick={redirect}>Already have an account?Login now</h3>
        </div>
      </form>
    </div>
  )
}

export default Register