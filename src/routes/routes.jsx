import React from 'react'
import Register from "../components/register"
import Doctor from '../components/doctorVerify'
import Login from '../components/login'
import Allappointment from '../pages/doctor/Allappointment'
import Doctorprofile from '../pages/doctor/doctorprofile'
import Userverify from '../components/userverify'
import { Routes, Route } from 'react-router-dom'
import Usermain from '../pages/user/usermain'
import AppointmentForm from '../pages/user/appointmentForm'
import Showappointent from '../pages/user/showappointent'
import Finddoctor from '../pages/user/finddoctor'
import Medicalrecords from '../pages/user/medicalrecords'
import Appointmentcompleted from '../pages/doctor/appointmentcompleted'
import Appointmentpending from '../pages/doctor/appointmentpending'
import Userprofileupdate from '../pages/user/userprofileupdate'
import Doctorprofileupdate from '../pages/doctor/doctorprofileupdate'
import ProtectedRoutes from '../components/protectedRoutes'
import Doctorchat from '../pages/doctor/doctorchat'
import Common from '../components/common'
import Applyticket from '../pages/user/aaplyticket'
import SupportTicket from '../pages/doctor/supportTicket'
import UserTickets from '../pages/user/userTickets'
import UserChats from '../pages/user/chat'
const AppRoutes = () => {
    const routes = [
        {
            path: "/",
            auth: false,
            component: <Register />
        },
        {
            path: "/Login",
            auth: false,
            component: <Login />,
        },
        {
            path: "/doctor/verify",
            auth: true,
            component: <Doctor />,
            allowedRoles: "doctor"

        },
        {
            path: "/doctor/ticket",
            auth: true,
            component: <SupportTicket />,
            allowedRoles: "doctor"

        },
        {
            path: "/doctor/allappointment",
            auth: true,
            component: <Allappointment />,
            allowedRoles: "doctor"
        },
        {
            path: "/doctor/profile",
            auth: true,
            component: <Doctorprofile />,
            allowedRoles: "doctor"

        },
        {
            path: "/doctor/appointmentcompleted",
            auth: true,
            component: <Appointmentcompleted />,
            allowedRoles: "doctor"
        }, {
            path: "/doctor/appointmentpending",
            auth: true,
            component: <Appointmentpending />,
            allowedRoles: "doctor"

        },
        {
            path: "/doctor/profileupdate",
            auth: true,
            component: <Doctorprofileupdate />,
            allowedRoles: "doctor"
        },
        {
            path: "/doctor/chat",
            auth: true,
            component: <Doctorchat />,
            allowedRoles: "doctor"
        },
        {
            path: "/user/verify",
            auth: true,
            component: <Userverify />,
            allowedRoles: "user"
        }, {
            path: "/user/appointmentform",
            auth: true,
            component: <AppointmentForm />,
            allowedRoles: "user",
            layout: "user"

        },
        {
            path: "/user/medicalrecords",
            auth: true,
            component: <Medicalrecords />,
            allowedRoles: "user",
            layout: "user"
        },
        {
            path: "/user/chat",
            auth: true,
            component: <UserChats />,
            allowedRoles: "user",
            layout: "user"
        },
        {
            path: "/user/tickets",
            auth: true,
            component: <UserTickets />,
            allowedRoles: "user",
            layout: "user"
        },
        {
            path: "/user/finddoctor",
            auth: true,
            component: <Finddoctor />,
            allowedRoles: "user",
            layout: "user"
        }, {
            path: "/user/profileupdate",
            auth: true,
            component: <Userprofileupdate />,
            allowedRoles: "user",
            layout: "user"

        },
        {
            path: "/user/showappointent",
            auth: true,
            component: <Showappointent />,
            allowedRoles: "user",
            layout: "user"
        },
        {
            path: "/user/main",
            auth: true,
            component: <Usermain />,
            allowedRoles: "user",
            layout: "user"
        },
        {
            path: "/user/applyTicket",
            auth: true,
            component: <Applyticket />,
            allowedRoles: "user",
            layout: "user"
        },
    ]
    return (
        <Routes>
            {routes.map((index, route) => {
                if (index.auth === true) {
                    if (index.layout === "user") {
                        return (
                            <Route element={<ProtectedRoutes allowedRoles={index.allowedRoles} />}>
                                <Route key={route} path={index.path} element={<Common>{index.component}</Common>} />
                            </Route>
                        )
                    }
                    return (
                        <Route element={<ProtectedRoutes allowedRoles={index.allowedRoles} />}>
                            <Route key={route} path={index.path} element={index.component} />
                        </Route>
                    )
                }
                else {
                    return (
                        <Route key={route} path={index.path}
                            element={index.component}
                        />
                    )
                }
            })}
        </Routes>
    )
}
export default AppRoutes
