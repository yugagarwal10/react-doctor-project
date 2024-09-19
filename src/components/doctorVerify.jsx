import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';
import "../App.css"
const Doctor = () => {
  const [info, setInfo] = useState({
    image: "",
    expertise: [],
    startShiftTime: "",
    endShiftTime: "",
    qualification:"",
    about:"",
  });
  const handleInputChange = (event) => {
    const { name, value, type} = event.target;

    if (type === 'select-multiple') {
      const selectedOptions = [...event.target.selectedOptions].map(option => option.value);
      setInfo((info) => ({
        ...info,
        [name]: selectedOptions,
      }));
    } else {
      setInfo((info) => ({
        ...info,
        [name]: value,
      }));
    }
  };

  const navigate = useNavigate();

  const handleImage = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post("http://localhost:5000/uploadImage", { image: info.image });
      console.log('Image uploaded successfully', response);
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()));
      console.error('Error uploading the image', Object.values(error.response.data).toString());
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {      
      const token = localStorage.getItem("token");
      const response = await axios.post("http://localhost:5000/addDoctorDetails", {
        image: info.image,
        expertise: info.expertise,
        startShiftTime: info.startShiftTime,
        endShiftTime:info.endShiftTime,
        token: token,
        qualification:info.qualification,
        about:info.about
      });
      console.log('Details uploaded successfully', response.data);
      navigate("/Doctorprofile")
      toast.success('Details uploaded successfully!');
    } catch (error) {
      toast.error((Object.values(error.response.data).toString()));
      console.error('Error submitting the form', Object.values(error.response.data).toString());
    }
  };

  return (
    <div className="wrapper">
      <h2>Doctor Details</h2>
      <form onSubmit={handleSubmit}>
        <div className="input-box">
          <input type="file" placeholder="Upload an image" name='image' onChange={handleInputChange}></input>
        </div>
        <div className="select-box">
          <select name='expertise' onChange={handleInputChange} multiple>
            <option value="Immunologists">Immunologists</option>
            <option value="Anesthesiologists">Anesthesiologists</option>
            <option value="Cardiologists">Cardiologists</option>
            <option value="Colon and Rectal Surgeons">Colon and Rectal Surgeons</option>
            <option value="Dermatologists">Dermatologists</option>
            <option value="Endocrinologists">Endocrinologists</option>
            <option value="Gastroenterologists">Gastroenterologists</option>
          </select>
        </div>
        <div className="input-box">
          <input type="time" placeholder="Enter shiftTime" name='startShiftTime' onChange={handleInputChange}></input>
        </div>
        <div className="input-box">
          <input type="time" placeholder="Enter shiftTime" name='endShiftTime' onChange={handleInputChange}></input>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Enter qualifications" name='qualification' onChange={handleInputChange}></input>
        </div>
        <div className="input-box">
          <input type="text" placeholder="Enter about you" name='about' onChange={handleInputChange}></input>
        </div>
        <div className="input-box button">
          <input type="submit"></input>
          <ToastContainer />
        </div>
      </form>
    </div>
  );
}

export default Doctor;
