import { jwtDecode } from 'jwt-decode';
import Swal from 'sweetalert2';

export const authMiddleware = () => {
    const token = sessionStorage.getItem('token');

    if (token) {
        try {
            const decode = jwtDdecode(token);
            const currentTime = Date.now() / 1000;

            if (decode.exp < currentTime) {
                sessionStorage.removeItem('token');
                Swal.fire({
                    title: 'Session Expired',
                    text: 'Your session has expired. Please login again.',
                    icon: 'warning',
                    confirmButtonText: 'OK'
                });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            sessionStorage.removeItem('token');
        }
    }
}

export const isAuthenticated = () => {
    const token = sessionStorage.getItem('token');
    if (!token) return false;

    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp > currentTime;
    } catch (error) {
        console.error('Error decoding token:', error);
        return false;
    }
};

export const checkAuth = (navigate) => {
    if (!isAuthenticated()) {
        Swal.fire({
            title: 'Authentication Required',
            text: 'Please login to access this page.',
            icon: 'warning',
            confirmButtonText: 'OK'
        }).then((result) => {
            if (result.isConfirmed) {
                navigate('/');
            }
        });
        return false;
    }
    return true;
};