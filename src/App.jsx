import React from 'react'
import Register from "./components/register"
import Doctor from './components/doctorVerify'
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
import ProtectedRoutes from './components/protectedRoutes'
const App = () => {
  return (
    <>
      <Routes>
        <Route path="/doctor/verify" element={<ProtectedRoutes allowedRoles={"doctor"}><Doctor /></ProtectedRoutes>} />
        <Route path="/doctor/allappointment" element={<ProtectedRoutes allowedRoles={"doctor"}><Allappointment /></ProtectedRoutes>} />
        <Route path="/doctor/profile" element={<ProtectedRoutes allowedRoles={"doctor"}><Doctorprofile /></ProtectedRoutes>} />
        <Route path="/doctor/appointmentcompleted" element={<ProtectedRoutes allowedRoles={"doctor"}><Appointmentcompleted /></ProtectedRoutes>} />
        <Route path="/user/profileupdate" element={<ProtectedRoutes allowedRoles={"user"}><Userprofileupdate /></ProtectedRoutes>} />
        <Route path="/doctor/appointmentpending" element={<ProtectedRoutes allowedRoles={"doctor"}><Appointmentpending /></ProtectedRoutes>} />
        <Route path="/doctor/profileupdate" element={<ProtectedRoutes allowedRoles={"doctor"}><Doctorprofileupdate /></ProtectedRoutes>} />
        <Route path="/user/verify" element={<ProtectedRoutes allowedRoles={"user"}><Userverify /></ProtectedRoutes>} />
        <Route path="/user/appointmentform" element={<ProtectedRoutes allowedRoles={"user"}><AppointmentForm /></ProtectedRoutes>} />
        <Route path="/user/medicalrecords" element={<ProtectedRoutes allowedRoles={"user"}><Medicalrecords /></ProtectedRoutes>} />
        <Route path="/user/finddoctor" element={<ProtectedRoutes allowedRoles={"user"}><Finddoctor /></ProtectedRoutes>} />
        <Route path="/user/showappointent" element={<ProtectedRoutes allowedRoles={"user"}><Showappointent /></ProtectedRoutes>} />
        <Route path="/user/main" element={<ProtectedRoutes allowedRoles={"user"}><Usermain /></ProtectedRoutes>} />
        <Route path="/" element={<Register />} />
        <Route path="/Login" element={<Login />} />
      </Routes>
    </>
  )
}

export default App