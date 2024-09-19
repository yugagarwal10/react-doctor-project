import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import "../userform.css"

const AppointmentForm = () => {
    const [info, setinfo] = useState({
        date: "",
        reason: "",
        doctor: "",
    })
    const [list, setlist] = useState([]);
    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setinfo((info) => ({
            ...info,
            [name]: value
        }))
    }
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const getdata = async () => {
        const result = await axios.get("http://localhost:5000/doctorList");
        setlist(result.data)
    }
    useEffect(() => {
        getdata()
    }, []);
    const handlesubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/addAppointment", {
                date: info.date,
                reason: info.reason,
                doctor: info.doctor
            },
                { headers: { token: token } });
            console.log('User saved:', response.data);
            toast.success('User register successfully!');
            navigate("/Showappointent");
        } catch (error) {
            toast.error((Object.values(error.response.data).toString()));
            console.error('Error uploading the image', Object.values(error.response.data).toString());
        }
    }
    return (
        <div>
            <div className="appointment-container floating-animation">
                <h2 className='heading'>Book an Appointment</h2>
                <form className="appointment-form" onSubmit={handlesubmit}>
                    <select name='doctor' value={info.doctor} onChange={handleInputChange} required>
                        <option value="" disabled>Select a doctor</option> 
                        {list.length > 0 ? (
                            list.map((user) => (
                                <option key={user._id} value={user.fullName}>{user.fullName}</option>
                            ))
                        ) : (
                            <option value="No users found" disabled>No doctors found</option>
                        )}
                    </select>
                    <input type="datetime-local" name="date" required onChange={handleInputChange}></input>
                    <textarea name="reason" placeholder="Reason for Appointment" rows="4" required onChange={handleInputChange}></textarea>
                    <button type="submit" className="submit-btn">Submit</button>
                </form>
            </div>
        </div>
        
    )
}

export default AppointmentForm