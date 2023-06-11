import React from 'react';
import { Routes, Route, BrowserRouter, Navigate, Link } from 'react-router-dom';

import { AuthProvider } from '../context/AuthProvider';
import { PublicLayout } from '../components/layout/public/PublicLayout';
import { Login } from '../components/user/Login';
import { Signup } from '../components/user/Signup';
import { PrivateLayout } from '../components/layout/private/PrivateLayout';
import { Feed } from '../components/publication/Feed';
import { Logout } from '../components/user/Logout';
import { Config } from '../components/user/Config';
import { People } from '../components/user/People';

export const Routing = () => {
    return (
        <BrowserRouter>
            <AuthProvider>
                <Routes>
                    <Route path='/' element={<PublicLayout />}>
                        <Route index element={<Login />} />
                        <Route path='login' element={<Login />} />
                        <Route path='signup' element={<Signup />} />
                    </Route>
                    <Route path='/social' element={<PrivateLayout />}>
                        <Route index element={<Feed />} />
                        <Route path='feed' element={<Feed />} />
                        <Route path='logout' element={<Logout />} />
                        <Route path='people' element={<People />} />
                        <Route path='config' element={<Config />} />
                    </Route>
                    <Route
                        path='*'
                        element={
                            <>
                                <h1>Error 404</h1>
                                <Link to='/'>Go back home</Link>
                            </>
                        }
                    />
                </Routes>
            </AuthProvider>
        </BrowserRouter>
    );
};
