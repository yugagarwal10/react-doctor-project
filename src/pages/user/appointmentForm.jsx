import { React, useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import "../../assets/userform.css";
import { API_URL } from '../../service/config';
import { get, post } from '../../service/axios';

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
    const getdata = async () => {
        await get(API_URL + "/doctor/doctorList")
            .then((result) => {
                setlist(result)
            })
            .catch((error) => {             
                toast.error(Object.values(error.response.data).toString());
            })
    }
    useEffect(() => {
        getdata();
    }, []);
    const handlesubmit = async (e) => {
        e.preventDefault();
        await post(API_URL + "/user/addAppointment", {
            date: info.date,
            reason: info.reason,
            doctor: info.doctor
        },
            )
            .then(() => {
                navigate("/user/showappointent");
            })
            .catch((error) => {
                toast.error(Object.values(error.response.data).toString());
            })
    }
    return (
        <div>
            <div className="appointment-container floating-animation font-serif">
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
                <div className="flex justify-center mt-8">
                    <button
                        onClick={() => navigate("/user/main")}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                    >
                        Go to Main Profile
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AppointmentForm