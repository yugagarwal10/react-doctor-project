import axios from "axios";
import { API_URL } from "./config";
export const decryptData = async (mac, value) => {
    try {
      const response = await axios.post(API_URL+"/DecryptData", { mac, value });
      return response
    } catch (error) {
      console.error('Error submitting the form', error);
    }
  };