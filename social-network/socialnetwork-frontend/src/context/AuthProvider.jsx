import React, { createContext, useState, useEffect } from 'react';
import { Global } from '../helpers/Global';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({});
    const [counters, setCounters] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        authUser();
    }, []);

    const authUser = async () => {
        // Get data from the localStorage (logged in user)
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');

        // Check the token and user
        if (!token || !user) {
            setLoading(false);
            return false;
        }

        // Transform data into JavaScript object
        const userObj = JSON.parse(user);
        const userId = userObj.id;

        // Check the token in the backend
        const request = await fetch(Global.url + 'user/profile/' + userId, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                authorization: token,
            },
        });

        const data = await request.json();

        // Request counters for the sidebar
        const requestCounters = await fetch(
            Global.url + 'user/counters/' + userId,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    authorization: token,
                },
            }
        );

        const dataCounters = await requestCounters.json();
        setAuth(data.user);
        setCounters(dataCounters);
        setLoading(false);
    };

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                counters,
                setCounters,
                loading,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
