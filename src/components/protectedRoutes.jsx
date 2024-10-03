import { Navigate } from 'react-router-dom';

function ProtectedRoutes(props) {
    const token = localStorage.getItem("token");
    if (!token) {
        return <Navigate to="/Login" />
    }
    else {
        return props.children;
    }
}
export default ProtectedRoutes
