import { API_URL } from "../service/config";
import { get } from "../service/axios";
import { toast } from "react-toastify";
import { useEffect } from "react";
export const Getdata = async (setInfo, token) => {
    const getData = async() => {
        await get(API_URL + "/fullAppointmentList", { headers: { authorization: token } })
        .then((res) => {
            setInfo(res.data);
        })
        .catch((error) => {
            console.log(error);
            toast.error("error fetching information")
        })
    };
    useEffect(() => {
        getData();
    }, [])
}
export const categorizeAppointments = (info,status) => {
    return info.filter((user) => user.status === status);
};
export const Logout = async (url,token) => {
    await get(API_URL + url, { headers: { authorization: token } })
      .then(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("type");
      })
      .catch((err) => {
        console.log("errrorrr");
      })
  }
  export const Userdata=(setuserinfo,token)=>{
    const getdata = async () => {
        await get(API_URL + "/getUserDetails", { headers: { authorization: token } })
            .then((result) => {                          
                setuserinfo(result.data);
            })
            .catch(()=>{
                console.log("errror");
            })
    }
    useEffect(() => {
        getdata();
    }, [])
  }