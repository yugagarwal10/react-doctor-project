import { Navigate, Outlet } from 'react-router-dom';

function ProtectedRoutes({ children, allowedRoles }) {    
    const token = localStorage.getItem("token");
    const type = localStorage.getItem("type");
    if (!token) {
        return <Navigate to="/Login" />
    }
    if (allowedRoles && allowedRoles != type) {
        if (type === "doctor") {
            return <Navigate to="/doctor/profile" />
        }
        else {
            return <Navigate to="/user/main" />
        }
    }
    else {
        return <Outlet/>;
    }
}
export default ProtectedRoutes
