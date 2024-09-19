import { React, useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import "../usermain.css"
import axios from 'axios';

const Usermain = () => {
  const [info, setinfo] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
  })
  const hndleinputchange = (event) => {
    event.preventDefault();

    const { name, value } = event.target;
    setinfo((info) => ({
      ...info,
      [name]: value
    }));
  };
  const decryptData = async (mac, value) => {
    try {
      const response = await axios.post("http://localhost:5000/DecryptData", { mac, value });
      return response
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };
  const navigate=useNavigate()
  const token = localStorage.getItem("token");
  useEffect(() => {
    getdata()
  }, []);
  const getdata = async () => {
    const result = await axios.get("http://localhost:5000/getUserDetails", { headers: { token: token } });
    const decryptdata = await decryptData(result.data.mac, result.data.value)
    setinfo(decryptdata.data);
  }
  const appointmentForm=(e)=>{
    e.preventDefault();
    navigate("/AppointmentForm")
  }
  const Showappointment=(e)=>{
    e.preventDefault();
    navigate("/Showappointent")
  }
  return (
    <div>
      <div className="container">
        <h1 className="title">Welcome to Your Dashboard</h1>
        <div className="user-info">
          <div className="user-avatar">
            <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTYP-KKtRJXm9qK7k2_PA1utxbxWdpzGIdulQ&s" alt="User Image"></img>
          </div>
          <div className="user-details">
            <h2>Name:{info.fullName.toUpperCase()}</h2>
            <p>Email:{info.email.toUpperCase()}</p>
            <p>Number:{info.contactNumber}</p>
          </div>
          <button className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>
        <div className="btn-group">
          <button className="btn btn-appointment" onClick={appointmentForm}>
            <i className="fas fa-calendar"></i> Book Appointment
          </button>
          <button className="btn btn-appointment" onClick={Showappointment}>
            <i className="fas fa-list-alt"></i>Showappointment
          </button>
          <button className="btn btn-appointment">
            <i className="fas fa-heartbeat"></i> Health Summary
          </button>
          <button className="btn btn-appointment">
            <i className="fas fa-user-md"></i> Find a Doctor
          </button>
          <button className="btn btn-appointment">
            <i className="fas fa-file-medical-alt"></i> Medical Records
          </button>
        </div>
      </div>
    </div>
  )
}

export default Usermain