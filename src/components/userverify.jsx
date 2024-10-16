import { React, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import "../assets/App.css"
import { useForm } from 'react-hook-form';
import { API_URL } from '../service/config';
import { post } from '../service/axios';
import axios from 'axios';

const Userverify = () => {
  const { handleSubmit, register, formState: { errors } } = useForm()
  const [info, setinfo] = useState({
    image: "",
    address: "",
    contactNumber: ""
  })
  const token = localStorage.getItem("token");
  const handleInputChange = (event) => {
    event.preventDefault();
    const { name, value, files, type } = event.target;
    if (type === 'file') {
      setinfo((info) => ({ ...info, [name]: files[0] }));
    }
    else {
      setinfo((info) => ({
        ...info,
        [name]: value
      }));
    }
  };
  const navigate = useNavigate();
  const handlesubmit = async (e) => {
    const formData = new FormData();
    formData.append("image", info.image);
    const image=await axios.post(API_URL +"/addUserImage",formData);
    await post(API_URL + "/addUserDetails", { image:image, address: info.address, contactNumber: info.contactNumber }, {
      headers: {
        authorization: token
      }
    }).then(() => {
      navigate("/user/main")
    })
      .catch((error) => {
        toast.error((Object.values(error.response.data).toString()))
      })
  }
  return (
    <div className="min-h-screen w-screen bg-gradient-to-br from-blue-100 via-purple-200 to-purple-500 flex justify-center items-center">
      <div className="w-full max-w-lg bg-white shadow-lg rounded-lg p-8 animate-fadeIn">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-6 animate-bounceIn">User Details</h2>
        <form onSubmit={handleSubmit(handlesubmit)} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Upload Image</label>
            <input type="file"
              {...register("image", { required: "image is required" })}
              name="image"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input type="text"
              {...register("address", { required: "address is required", pattern: { value: /^[a-zA-Z0-9- ]+$/, message: "Invalid address" } })}
              name="address"
              placeholder="Enter Address"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">ContactNumber</label>
            <input type="text"
              {...register("contactNumber", { required: "contactNumber is required", pattern: { value: /^[0-9]{10}$/, message: "Invalid contactNumber" } })}
              name="contactNumber"
              placeholder="Enter contactNumber"
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm transition-transform duration-300 hover:scale-105"
              onChange={handleInputChange} />
            {errors.contactNumber && <span className="text-red-500 text-sm">{errors.contactNumber.message}</span>}
          </div>
          <div className="mt-6">
            <button type="submit" className="w-full bg-purple-600 text-white font-semibold py-3 rounded-md shadow-lg hover:bg-purple-700 transition-all duration-300 ease-in-out transform hover:scale-105">
              Submit
            </button>
          </div>
        </form>
      </div>
      <style>{`
  .animate-fadeIn {
    animation: fadeIn 0.8s ease-in-out;
  }
  .animate-bounceIn {
    animation: bounceIn 0.8s ease-in-out;
  }
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  @keyframes bounceIn {
    0% {
      opacity: 0;
      transform: scale(0.9);
    }
    50% {
      opacity: 0.5;
      transform: scale(1.05);
    }
    100% {
      opacity: 1;
      transform: scale(1);
    }
  }
`}</style>
    </div>
  )
}

export default Userverify