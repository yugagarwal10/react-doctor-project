import CryptoJS from "crypto-js"; 
import { unserialize } from "php-serialize";  
import { DECRYPTION_KEY, API_DECRYPTION_KEY } from "../service/config"; 


class Security { 
  
    decrypt(response, _unserialize = false) { 
        const value= response.data.value;        
        try {         
            const decrypted = CryptoJS.AES.decrypt(value, CryptoJS.enc.Utf8.parse(DECRYPTION_KEY), { 
                iv: CryptoJS.enc.Utf8.parse(API_DECRYPTION_KEY), 
                padding: CryptoJS.pad.Pkcs7, 
                mode: CryptoJS.mode.CBC, 
            }).toString(CryptoJS.enc.Utf8);        
            if (!decrypted) { 
                throw new Error("Decryption failed. Invalid data."); 
            } 
            return _unserialize ? unserialize(JSON.parse(decrypted)) : JSON.parse(decrypted); 
        } catch (error) { 
            console.error("Decryption error:", error); 
            throw new Error("DecryptionException - The data could not be decrypted."); 
        } 
    } 

} 

export default Security; 