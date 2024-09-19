import React, { useState } from 'react'
import {useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import "../App.css"

const Userverify = () => {
  const [info, setinfo] = useState({
    image: "",
    address: "",
    contactNumber: ""
  })
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
      const token=localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/addUserDetails", {
        image: info.image,
        address: info.address,
        contactNumber:info.contactNumber,
        token:token
      });
      console.log('data uploaded:', response.data);
      toast.success('data uploaded successfully!');
      navigate("/Usermain")
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()))
      console.error('Error submitting the form', (Object.values(error.response.data).toString()));
    }
  }
  return (
    <div>
      <div className="wrapper">
        <h2>User Details</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-box">
            <input type="file" placeholder="Upload an image" name='image' onChange={handleInputChange}></input>
          </div>
          <div className="input-box">
            <input type="text" placeholder="Enter Address" name='address'onChange={handleInputChange}></input>
          </div>
          <div className="input-box">
            <input type="text" placeholder="Enter Contact Number" name='contactNumber'onChange={handleInputChange}></input>
          </div>
          <div className="input-box button">
            <input type="submit"></input><ToastContainer/>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Userverify