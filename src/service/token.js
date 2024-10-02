import { useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
export const CheckToken = (token) => {
    const navigate=useNavigate();
    useEffect(() => {
        if (!token) {
            navigate("/Login")
        }
    },[])
}