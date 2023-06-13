import React, { useEffect, useState } from 'react';
import avatar from '../../../assets/img/user.png';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';
import { Link } from 'react-router-dom';
import { useForm } from '../../../hooks/useForm';

export const SideBar = () => {
    const { auth, counters, setCounters } = useAuth();
    const [avatarUser, setAvatarUser] = useState('');
    const { form, changed } = useForm({});
    const [stored, setStored] = useState('not_stored');
    const [count, setCount] = useState({});

    useEffect(() => {
        getAvatar();
    }, [auth.image]);

    useEffect(() => {
        getCounters();
    }, [counters, stored]);

    const getCounters = async () => {
        const request = await fetch(Global.url + 'user/counters/' + auth._id, {
            method: 'GET',
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                // prettier-ignore
            },
        });
        const data = await request.json();
        if (data.following) {
            setCounters(data);
        }
    };

    // Get the user avatar.
    const getAvatar = async () => {
        if (auth.image !== undefined) {
            const request = await fetch(
                Global.url + 'user/avatar/' + auth._id,
                {
                    method: 'GET',
                }
            );

            const data = await request.json();
            if (data.status === 'success') {
                setAvatarUser(data.avatarImage);
            } else {
                setAvatarUser(auth.image);
            }
        }
    };

    const savePublication = async (e) => {
        e.preventDefault();

        // Get data from the form
        let newPublication = form;
        newPublication.user = auth._id;

        // Request to save
        const request = await fetch(Global.url + 'publication/save', {
            method: 'POST',
            body: JSON.stringify(newPublication),
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                // prettier-ignore
            },
        });
        const data = await request.json();

        // Check errors
        if (data.status === 'success') {
            setStored('stored');
        } else {
            setStored('error');
        }

        // Upload Image
        const fileInput = document.querySelector('#picture');
        if (data.status === 'success' && fileInput.files[0]) {
            const formData = new FormData();
            formData.append('picture', fileInput.files[0]);

            const uploadRequest = await fetch(
                Global.url + 'publication/upload/' + data.publicationStored._id,
                {
                    method: 'POST',
                    body: formData,
                    headers: {
                        // prettier-ignore
                        //'Content-Type': 'application/json',
                        'Authorization': localStorage.getItem('token'),
                        // prettier-ignore
                    },
                }
            );
            const uploadData = await uploadRequest.json();
            if (uploadData.status === 'success') {
                setStored('stored');
            } else {
                setStored('error');
            }
        }
        //if (data.status === 'success' && uploadData.status === 'success') {
        const myForm = document.querySelector('#publication-form');
        myForm.reset();
        setTimeout(() => {
            setStored('not_stored');
        }, 1000);
        //}
    };

    return (
        <aside className='layout__aside'>
            <header className='aside__header'>
                <h1 className='aside__title'>Hello, {auth.name}</h1>
            </header>

            <div className='aside__container'>
                <div className='aside__profile-info'>
                    <div className='profile-info__general-info'>
                        <div className='general-info__container-avatar'>
                            <img
                                src={avatarUser}
                                className='container-avatar__img'
                                alt='profile picture'
                            />
                        </div>
                        <div className='general-info__container-names'>
                            <Link
                                to={'/social/profile/' + auth._id}
                                className='container-names__name'
                            >
                                {auth.name} {auth.surname}
                            </Link>
                            <p className='container-names__nickname'>
                                {auth.nick}
                            </p>
                        </div>
                    </div>

                    <div className='profile-info__stats'>
                        <div className='stats__following'>
                            <Link
                                to={'/social/following/' + auth._id}
                                className='following__link'
                            >
                                <span className='following__title'>
                                    Following
                                </span>
                                <span className='following__number'>
                                    {counters.following || 0}
                                </span>
                            </Link>
                        </div>
                        <div className='stats__following'>
                            <Link
                                to={'/social/followers/' + auth._id}
                                className='following__link'
                            >
                                <span className='following__title'>
                                    Followers
                                </span>
                                <span className='following__number'>
                                    {counters.followed || 0}
                                </span>
                            </Link>
                        </div>

                        <div className='stats__following'>
                            <Link
                                to={'/social/profile/' + auth._id}
                                className='following__link'
                            >
                                <span className='following__title'>Posts</span>
                                <span className='following__number'>
                                    {counters.publications || 0}
                                </span>
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='aside__container-form'>
                    {stored === 'stored' ? (
                        <strong className='alert alert-success'>
                            Post published
                        </strong>
                    ) : (
                        ''
                    )}
                    {stored === 'error' ? (
                        <strong className='alert alert-danger'>
                            Post not published
                        </strong>
                    ) : (
                        ''
                    )}
                    <form
                        className='container-form__form-post'
                        onSubmit={savePublication}
                        id='publication-form'
                    >
                        <div className='form-post__inputs'>
                            <label htmlFor='text' className='form-post__label'>
                                What are you doing?
                            </label>
                            <textarea
                                name='text'
                                id='text'
                                className='form-post__textarea'
                                onChange={changed}
                            />
                        </div>
                        <div className='form-post__inputs'>
                            <label htmlFor='file0' className='form-post__label'>
                                Upload post image
                            </label>
                            <input
                                type='file'
                                name='file0'
                                id='picture'
                                className='form-post__image'
                            />
                        </div>
                        <input
                            type='submit'
                            value='Send'
                            className='form-post__btn-submit'
                        />
                    </form>
                </div>
            </div>
        </aside>
    );
};
