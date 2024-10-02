import { React, useState, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import "../assets/usermain.css"
import axios from 'axios';
import { API_URL } from '../service/config';
import { decryptData } from '../service/decrypt';

const Usermain = () => {
  const [info, setinfo] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    image:"",
  })
  const navigate=useNavigate()
  const token = localStorage.getItem("token");
  useEffect(()=>{
    if(!token){
      navigate("/Login")
    }
    else{
      getdata()
    }
  },[]);
  const getdata = async () => {
    try {
      const result = await axios.get(API_URL+"/getUserDetails", { headers: { token: token } });
      const decryptdata = await decryptData(result.data.mac, result.data.value)
      setinfo(decryptdata.data); 
    } catch (error) {
      if(error.response.status==401){
        navigate("/Login")
      }      
    }
  }
  const logout=async(e)=>{
    e.preventDefault();
    const result = await axios.get(API_URL+"/userLogout", { headers: { token:token } });
    localStorage.removeItem("token");
    navigate("/Login")
  }
  const url=API_URL+`/uploads/userProfile/${info.image}`
  return (
    <div>
      <div className="container">
        <h1 className="title">Welcome to Your Dashboard</h1>
        <div className="user-info">
          <div className="user-avatar">
            <img src={url} alt="User Image"></img>
          </div>
          <div className="user-details">
            <h2>Name:{info.fullName.toUpperCase()}</h2>
            <p>Email:{info.email.toUpperCase()}</p>
            <p>Number:{info.contactNumber}</p>
          </div>
          <button onClick={logout}className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>
        <div className="btn-group">
          <button className="btn btn-appointment" onClick={()=>navigate("/AppointmentForm")}>
            <i className="fas fa-calendar"></i> Book Appointment
          </button>
          <button className="btn btn-appointment" onClick={()=>navigate("/Showappointent")}>
            <i className="fas fa-list-alt"></i>Show Appointment
          </button>
          <button className="btn btn-appointment" onClick={()=>navigate("/Finddoctor")}>
            <i className="fas fa-user-md"></i> Find A Doctor
          </button>
          <button className="btn btn-appointment" onClick={()=>navigate("/Medicalrecords")}>
            <i className="fas fa-file-medical-alt"></i> Medical Records
          </button>
          <button className="btn btn-appointment" onClick={()=>navigate("/Userprofileupdate")}>
            <i className="fas fa-file-medical-alt"></i> Update Profile
          </button>
        </div>
      </div>
    </div>
  )
}

export default Usermain