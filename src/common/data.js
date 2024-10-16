import { API_URL } from "../service/config";
import { get } from "../service/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setAppointment } from "../redux/slice";
import axios from "axios";
const token=localStorage.getItem("token");
export const Getdata = async () => {
    const dispatch = useDispatch()
    const getData = async () => {
        await axios.get(API_URL + "/fullAppointmentList", { headers: { authorization: token } })
            .then((res) => {
                dispatch(setAppointment(res))
            })
            .catch((error) => {
                console.log(error, "user-details");
                toast.error("error fetching information")
            })
    };
    useEffect(() => {
        getData();
    }, [])
}
export const categorizeAppointments = (info, status) => {
    return info.filter((user) => user.status === status);
};
export const Logout = async (url) => {
    await axios.get(API_URL + url, { headers: { authorization: token } })
        .then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("type");
        })
        .catch((err) => {
            console.log("errrorrr");
        })
}
export const Userdata = (setuserinfo) => {
    const getdata = async () => {
        await axios.get(API_URL + "/getUserDetails", { headers: { authorization: token } })
            .then((result) => {
                setuserinfo(result);
            })
            .catch((error) => {
                console.log(error);
            })
    }
    useEffect(() => {
        getdata();
    }, [])
}