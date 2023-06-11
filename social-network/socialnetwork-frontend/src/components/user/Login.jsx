import React, { useState } from 'react';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import useAuth from '../../hooks/useAuth';

export const Login = () => {
    const { form, changed } = useForm({});
    const [saved, setSaved] = useState('not_sent');
    const { setAuth } = useAuth();

    const loginUser = async (e) => {
        e.preventDefault();

        // Form data
        let userToLogin = form;

        // Request data
        const request = await fetch(Global.url + 'user/login', {
            method: 'POST',
            body: JSON.stringify(userToLogin),
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await request.json();

        //save data to the browser
        if (data.status === 'success') {
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            setSaved('login');

            // Set data in auth
            setAuth(data.user);

            // Redirect
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } else {
            setSaved('error');
        }
    };

    return (
        <>
            <header className='content__header content__header--public'>
                <h1 className='content__title'>Login</h1>
            </header>
            <div className='content_posts' onSubmit={loginUser}>
                {saved === 'login' ? (
                    <strong className='alert alert-success'>
                        User logged in
                    </strong>
                ) : (
                    ''
                )}
                {saved === 'error' ? (
                    <strong className='alert alert-danger'>
                        User not logged in
                    </strong>
                ) : (
                    ''
                )}
                <form className='form-login'>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input type='email' name='email' onChange={changed} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input
                            type='password'
                            name='password'
                            onChange={changed}
                        />
                    </div>
                    <input
                        type='submit'
                        value='Login'
                        className='btn btn-success'
                    />
                </form>
            </div>
        </>
    );
};
