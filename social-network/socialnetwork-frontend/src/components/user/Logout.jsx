import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export const Logout = () => {
    const navigate = useNavigate();
    const { setAuth, setCounters } = useAuth();

    useEffect(() => {
        // Clear localStorage
        localStorage.clear();

        // Set global variables to 0
        setAuth({});
        setCounters({});

        // Navigate to Login
        navigate('/login');
    });

    return <h1>logout</h1>;
};
