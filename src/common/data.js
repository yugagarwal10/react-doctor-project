import { API_URL } from "../service/config";
import { setAppointment } from "../redux/slice";
import axios from "axios";
import { toast } from "react-toastify";
import { get } from "../service/axios";
const token = localStorage.getItem("token");
export const Getdata = async (dispatch) => {
    const token = localStorage.getItem("token");
    try {
        const response = await axios.get(API_URL + "/fullAppointmentList", {
            headers: { authorization: token },
        });
        dispatch(setAppointment(response));
    } catch (error) {
        console.log("Error fetching appointments: ", error);
    }
};
export const categorizeAppointments = (info, status) => {
    return info.filter((user) => user.status === status);
};
export const Logout = async (url) => {
    await get(API_URL + url)
        .then(() => {
            localStorage.removeItem("token");
            localStorage.removeItem("type");
        })
        .catch((err) => {
            console.log("errrorrr");
        })
}
export const Userdata = async (setuserinfo) => {
    await get(API_URL + "/user/getUserDetails")
        .then((result) => {
            setuserinfo(result);
        })
        .catch((error) => {
            toast.error(error);
        })
}
