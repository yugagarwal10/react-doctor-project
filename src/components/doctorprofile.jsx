import { React, useEffect, useState } from 'react'
import "../doctorprofile.css"
import { useNavigate,Link } from 'react-router-dom'
import axios from 'axios'

const Doctorprofile = () => {
    const navigate = useNavigate();
    const redirect = () => {
        navigate("/Doctormain")
    }
    const [info, setinfo] = useState({
        fullName: "",
        expertise: [],
        email: "",
        qualification: "",
        about: ""
    });
    const decryptData = async (mac, value) => {
        try {
            const response = await axios.post("http://localhost:5000/DecryptData", { mac, value });
            return response            
        } catch (error) {
            console.error('Error submitting the form', error);
        }
    };
    const token = localStorage.getItem("token");
    useEffect(() => {
        getdata()
    }, []);
    const getdata = async () => {
        const result = await axios.get("http://localhost:5000/doctorDetails", { headers: { token: token } });
        const decryptdata = await decryptData(result.data.mac, result.data.value)
        setinfo(decryptdata.data);
        console.log(info);
    }
    return (
        <div>
            <nav className="navbar navbar-expand-lg navbar-light">
                <p className="navbar-brand">Doctor Profile</p>
                <div className="collapse navbar-collapse justify-content-end">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <p className="nav-link"><i className="fas fa-home"></i> Home</p>
                        </li>
                        <li className="nav-item">
                            <p className="nav-link"><i className="fas fa-sign-out-alt"></i> Logout</p>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="container doctor-card">
                <div className="row">
                    <div className="col-md-3 text-center">
                        <img src="https://img.freepik.com/free-vector/doctor-character-background_1270-84.jpg" alt="Doctor Image" className="profile-img"></img>
                    </div>
                    <div className="col-md-9 doctor-info">
                        <h2 className='profile-heading'>{info.fullName.toUpperCase()}</h2>
                        <p>
                            <strong>Specialty:</strong>
                            {info?.expertise && Array.isArray(info.expertise)
                                ? info.expertise.map((item, index) => (
                                    <span key={index}>
                                        {item}
                                        {index < info.expertise.length - 1 && ', '}
                                    </span>
                                ))
                                : 'Cardiologist'}
                        </p>
                        <p><strong>Qualification:</strong>{info.qualification}</p>
                        <p><strong>Contact:</strong> {info.email}</p>
                    </div>
                </div>
            </div>

            <div className="container appointment-section">
                <div className="row appointment-buttons text-center">
                    <div className="col-md-4">
                        <button className="btn btn-outline-primary btn-lg" onClick={redirect}><i className="fas fa-clock"></i> Pending Appointments</button>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-outline-success btn-lg"><i className="fas fa-check"></i> Completed Appointments</button>
                    </div>
                    <div className="col-md-4">
                        <button className="btn btn-outline-info btn-lg"><i className="fas fa-list"></i> All Appointments</button>
                    </div>
                </div>
            </div>

            <div className="container experience-card">
                <h4 className="card-title">Doctor's Experience</h4>
                <p>{info.about}</p>
            </div>
        </div>
    )
}

export default Doctorprofile