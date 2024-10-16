import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { API_URL } from '../../service/config';
import { Userdata } from '../../common/data';
import { patch } from '../../service/axios';

const Userprofileupdate = () => {
    const token = localStorage.getItem("token");
    const { handleSubmit, register, formState: { errors } } = useForm()
    const [info, setinfo] = useState({
        fullName: "",
        contactNumber: "",
        address: "",
        email: ""
    })
    const [userinfo, setuserinfo] = useState({
        fullName: "",
        email: "",
        contactNumber: "",
        address: "",
    })
    Userdata(setuserinfo, token)
    const handleInputChange = (event) => {
        event.preventDefault();
        const { name, value } = event.target;
        setinfo((info) => ({
            ...info,
            [name]: value
        }));
    };
    const navigate = useNavigate();
    const handlesubmit = async () => {
        await patch(API_URL + "/updateUserProfile", {
            fullName: info.fullName,
            contactNumber: info.contactNumber,
            email: info.email,
            address: info.address
        })
            .then(() => {
                navigate("/user/main");
            })
            .catch((error) => {
                toast.error(Object.values(error.response.data).toString());
            })
    }
    return (
        <div className="min-h-screen w-screen bg-white flex items-center justify-center p-6 relative">
            <div className="absolute top-0 left-0 w-48 h-48 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-0 right-0 w-48 h-48 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-2000"></div>

            <div className="relative bg-white rounded-2xl border border-gray-300 shadow-2xl p-12 w-full max-w-4xl transform transition duration-500 hover:scale-105 hover:shadow-xl">
                <h1 className="text-5xl font-extrabold mb-8 fade-in drop-shadow-lg text-center">Update Profile</h1>
                <form onSubmit={handleSubmit(handlesubmit)} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="full_name">Full Name</label>
                            <input type="text"
                                {...register("fullName", { pattern: { value: /^[a-zA-Z ]{5,25}$/, message: "fullName is not valid" } })} name="fullName" id="full_name" onChange={handleInputChange} className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-blue-500 focus:outline-none focus:border-blue-500 transition-all duration-300 hover:shadow-lg hover:scale-105" defaultValue={userinfo.fullName}></input>
                            {errors.fullName && <span className="text-red-500 text-sm">{errors.fullName.message}</span>}
                        </div>
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="email">Email</label>
                            <input type="email"
                                {...register("email", { pattern: { value: /^[a-zA-Z0-9.]+@[a-z]+.[a-z]+$/, message: "Email is not valid" } })} onChange={handleInputChange} name="email" id="email" className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-purple-500 focus:outline-none focus:border-purple-500 transition-all duration-300 hover:shadow-lg hover:scale-105" defaultValue={userinfo.email} ></input>
                            {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="phone">Phone Number</label>
                            <input type="tel"
                                {...register("contactNumber", { pattern: { value: /^[0-9]{10}$/, message: "Invalid contactNumber" } })} onChange={handleInputChange} name="contactNumber" id="phone" className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-green-500 focus:outline-none focus:border-green-500 transition-all duration-300 hover:shadow-lg" defaultValue={userinfo.contactNumber} ></input>
                            {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber.message}</span>}
                        </div>

                        <div className="relative">
                            <label className="block text-lg font-medium text-gray-700 mb-3" htmlFor="address">Address</label>
                            <input type="text"{...register("address", { pattern: { value: /^[a-zA-Z0-9 ,._-]{5,50}$/, message: "Invalid address" } })}
                                onChange={handleInputChange} name="address" id="address"
                                className="w-full px-6 py-3 text-gray-900 bg-gray-50 rounded-xl border border-gray-300 focus:ring-4 focus:ring-yellow-500 focus:outline-none focus:border-yellow-500 transition-all duration-300 hover:shadow-lg hover:scale-105" defaultValue={userinfo.address}></input>
                            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button type="submit" className="w-1/2 py-3 px-6 bg-blue-500 text-white font-semibold rounded-xl shadow-lg hover:bg-blue-600 transition-transform duration-300 hover:scale-110 hover:shadow-2xl">
                            Update Profile
                        </button>
                    </div>
                    <div class="mt-10 w-full flex justify-center space-x-4 fade-in">
                        <button
                            onClick={() => navigate("/user/main")}
                            className="bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:from-blue-600 hover:to-purple-700 transition duration-300 transform hover:scale-105"
                        >
                            Go to Main Profile
                        </button>
                    </div>
                </form>
            </div>
        </div>

    )
}

export default Userprofileupdate
