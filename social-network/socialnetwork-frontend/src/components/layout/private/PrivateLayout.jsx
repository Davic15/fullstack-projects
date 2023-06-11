import React from 'react';
import { SideBar } from './SideBar';
import { Header } from '../private/Header';
import { Navigate, Outlet } from 'react-router-dom';
import useAuth from '../../../hooks/useAuth';

export const PrivateLayout = () => {
    const { auth, loading } = useAuth();
    if (loading) {
        return <h1>Loading</h1>;
    } else {
        return (
            <>
                {/* Layout */}
                <Header />

                {/* Main Content */}
                <section className='layout__content'>
                    {auth._id ? <Outlet /> : <Navigate to='/login' />}
                </section>

                {/* Side Bar */}
                <SideBar />
            </>
        );
    }
};
