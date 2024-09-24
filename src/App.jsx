import React from 'react'
import Register from "./components/register"
import  Doctor from './components/doctorVerify'
import Login from './components/login'
import Allappointment from './components/Allappointment'
import Doctorprofile from './components/doctorprofile'
import Userverify from './components/userverify'
import { Routes, Route } from 'react-router-dom'
import Usermain from './components/usermain'
import AppointmentForm from './components/appointmentForm'
import Showappointent from './components/showappointent'
import Finddoctor from './components/finddoctor'
import Medicalrecords from './components/medicalrecords'
import Appointmentcompleted from './components/appointmentcompleted'
import Appointmentpending from './components/appointmentpending'
import Userprofileupdate from './components/userprofileupdate'
import Doctorprofileupdate from './components/doctorprofileupdate'
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Register />} />
        <Route path="/Doctor" element={<Doctor />} />
        <Route path="/Allappointment" element={<Allappointment />} />
        <Route path="/Doctorprofile" element={<Doctorprofile />} />
        <Route path="/Appointmentcompleted" element={<Appointmentcompleted />} />
        <Route path="/Userprofileupdate" element={<Userprofileupdate />} />
        <Route path="/Appointmentpending" element={<Appointmentpending />} />
        <Route path="/Doctorprofileupdate" element={<Doctorprofileupdate />} />
        <Route path="/Userverify" element={<Userverify />} />
        <Route path="/AppointmentForm" element={<AppointmentForm />} />
        <Route path="/Medicalrecords" element={<Medicalrecords />} />
        <Route path="/Finddoctor" element={<Finddoctor />} />
        <Route path="/Showappointent" element={<Showappointent />} />
        <Route path="/Usermain" element={<Usermain />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App