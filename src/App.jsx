import React from 'react'
import Register from "./components/register"
import  Doctor from './components/doctorVerify'
import Login from './components/login'
import Doctormain from './components/doctormain'
import Doctorprofile from './components/doctorprofile'
import Userverify from './components/userverify'
import { Routes, Route } from 'react-router-dom'
import Usermain from './components/usermain'
import AppointmentForm from './components/appointmentForm'
import Showappointent from './components/showappointent'
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Doctormain" element={<Doctormain />} />
        <Route path="/Doctorprofile" element={<Doctorprofile />} />
        <Route path="/Userverify" element={<Userverify />} />
        <Route path="/AppointmentForm" element={<AppointmentForm />} />
        <Route path="/Showappointent" element={<Showappointent />} />
        <Route path="/Usermain" element={<Usermain />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App