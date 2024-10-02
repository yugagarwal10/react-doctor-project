import React from 'react'
import Register from "./components/register"
import  Doctor from './components/doctorVerify'
import Login from './components/login'
import Allappointment from './pages/doctor/Allappointment'
import Doctorprofile from './pages/doctor/doctorprofile'
import Userverify from './components/userverify'
import { Routes, Route } from 'react-router-dom'
import Usermain from './pages/user/usermain'
import AppointmentForm from './pages/user/appointmentForm'
import Showappointent from './pages/user/showappointent'
import Finddoctor from './pages/user/finddoctor'
import Medicalrecords from './pages/user/medicalrecords'
import Appointmentcompleted from './pages/doctor/appointmentcompleted'
import Appointmentpending from './pages/doctor/appointmentpending'
import Userprofileupdate from './pages/user/userprofileupdate'
import Doctorprofileupdate from './pages/doctor/doctorprofileupdate'
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/doctor/verify" element={<Doctor />} />
        <Route path="/doctor/allappointment" element={<Allappointment />} />
        <Route path="/doctor/profile" element={<Doctorprofile />} />
        <Route path="/doctor/appointmentcompleted" element={<Appointmentcompleted />} />
        <Route path="/user/profileupdate" element={<Userprofileupdate />} />
        <Route path="/doctor/appointmentpending" element={<Appointmentpending />} />
        <Route path="/doctor/profileupdate" element={<Doctorprofileupdate />} />
        <Route path="/user/verify" element={<Userverify />} />
        <Route path="/user/appointmentform" element={<AppointmentForm />} />
        <Route path="/user/medicalrecords" element={<Medicalrecords />} />
        <Route path="/user/finddoctor" element={<Finddoctor />} />
        <Route path="/user/showappointent" element={<Showappointent />} />
        <Route path="/user/main" element={<Usermain />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App