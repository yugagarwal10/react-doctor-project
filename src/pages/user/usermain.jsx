import { React, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import "../../assets/usermain.css"
import { API_URL } from '../../service/config';
import { Getdata, Logout, Userdata } from '../../common/data';
import { useDispatch } from 'react-redux';
import { setUser } from '../../redux/userslice';

const Usermain = () => {
  const dispatch = useDispatch();
  const [info, setinfo] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    image: "",
  });
  const navigate = useNavigate();
  const logout = () => {
    Logout("/user/Logout");
    navigate("/Login")
  }
dispatch(setUser(info))
    useEffect(() => {
        Getdata(dispatch);
        Userdata(setinfo);
    }, [dispatch]);
  return (
    <div>
      <div className="container">
        <h1 className="title">Welcome to Your Dashboard</h1>
        {info?(<div className="user-info">
          <div className="user-avatar">
            <img src={API_URL + `/uploads/userProfile/${info?.image}`} alt="User"></img>
          </div>
          <div className="user-details">
            <h2>Name:{info.fullName.toUpperCase()}</h2>
            <p>Email:{info.email.toUpperCase()}</p>
            <p>Number:{info.contactNumber}</p>
          </div>
          <button onClick={logout} className="logout-btn">
            <i className="fas fa-sign-out-alt"></i> Log Out
          </button>
        </div>):(<p>loading details</p>)}
        <div className="btn-group">
          <button className="btn btn-appointment" onClick={() => navigate("/user/appointmentform")}>
            <i className="fas fa-calendar"></i> Book Appointment
          </button>
          <button className="btn btn-appointment" onClick={() => navigate("/user/showappointent")}>
            <i className="fas fa-list-alt"></i>Show Appointment
          </button>
          <button className="btn btn-appointment" onClick={() => navigate("/user/finddoctor")}>
            <i className="fas fa-user-md"></i> Contact Us
          </button>
          <button className="btn btn-appointment" onClick={() => navigate("/user/medicalrecords")}>
            <i className="fas fa-file-medical-alt"></i> Medical Records
          </button>
          <button className="btn btn-appointment" onClick={() => navigate("/user/profileupdate")}>
            <i className="fas fa-file-medical-alt"></i> Update Profile
          </button>
          <button className="btn btn-appointment" onClick={() => navigate("/user/tickets")}>
            <i className="fas fa-file-medical-alt"></i> Complain History
          </button>
        </div>
      </div>
    </div>
  )
}

export default Usermain