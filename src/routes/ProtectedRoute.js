import React, {useEffect} from 'react';
import { Navigate } from 'react-router-dom';
import {useDispatch} from "react-redux";
import {setUnauthenticated} from "../redux/authSlice";

const ProtectedRoute = ({ isAuthenticated, children }) => {

    const dispatch = useDispatch();

    useEffect(() => {
        const timestamp = localStorage.getItem("authTimestamp");
        const now = Date.now();
        const authDuration = 3 * 60 * 60 * 1000;

        if (!timestamp || now - parseInt(timestamp, 10) >= authDuration) {
            dispatch(setUnauthenticated());
        }
    }, [dispatch]);

    if (!isAuthenticated) {
        return <Navigate to="/auth" />;
    }
    return children;
};

export default ProtectedRoute;