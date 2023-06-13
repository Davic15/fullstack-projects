import React, { useState, useEffect } from 'react';
import useAuth from '../../hooks/useAuth';
import { Global } from '../../helpers/Global';
import { SerializeForm } from '../../helpers/SerializeForm';

export const Config = () => {
    const { auth, setAuth } = useAuth();
    const [saved, setSaved] = useState('not_saved');

    const [avatarUser, setAvatarUser] = useState('');

    useEffect(() => {
        getAvatar();
    }, [avatarUser]);

    // Get the user avatar.
    const getAvatar = async () => {
        const request = await fetch(Global.url + 'user/avatar/' + auth._id, {
            method: 'GET',
        });

        const data = await request.json();
        if (data.status === 'success') {
            setAvatarUser(data.avatarImage);
        } else {
            setAvatarUser(auth.image);
        }
    };

    const updateUser = async (e) => {
        e.preventDefault();

        const authorizationToken = localStorage.getItem('token');
        let newDataUser = SerializeForm(e.target);
        const request = await fetch(Global.url + 'user/update', {
            method: 'PUT',
            body: JSON.stringify(newDataUser),
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': authorizationToken,
                // prettier-ignore
            },
        });
        const data = await request.json();
        if (data.status === 'success' && data.user) {
            delete data.user.password;
            setAuth(data.user);
            setSaved('saved');
        } else {
            setSaved('error');
        }

        // Upload images
        const fileInput = document.querySelector('#picture');
        if (data.status === 'success' && fileInput.files[0]) {
            //* Get image to upload
            const formData = new FormData();
            formData.append('picture', fileInput.files[0]);

            //* Upload image to the backed.
            const uploadRequest = await fetch(Global.url + 'user/upload', {
                method: 'POST',
                body: formData,
                headers: {
                    // prettier-ignore
                    'Authorization': authorizationToken,
                    // prettier-ignore
                },
            });
            const uploadData = await uploadRequest.json();
            if (uploadData.status === 'success' && uploadData.user) {
                delete uploadData.user.password;
                setAuth(uploadData.user);
                setSaved('saved');
            } else {
                setSaved('error');
            }
        }
    };

    return (
        <>
            <header className='content__header content__header--public'>
                <h1 className='content__title'>Config</h1>
            </header>
            <div className='content__post'>
                {saved === 'saved' ? (
                    <strong className='alert alert-success'>
                        User Updated
                    </strong>
                ) : (
                    ''
                )}
                {saved === 'error' ? (
                    <strong className='alert alert-danger'>
                        User was not updated
                    </strong>
                ) : (
                    ''
                )}
                <form className='config-form' onSubmit={updateUser}>
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input
                            type='text'
                            name='name'
                            defaultValue={auth.name}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='surname'>Surname</label>
                        <input
                            type='text'
                            name='surname'
                            defaultValue={auth.surname}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='nick'>Nick</label>
                        <input
                            type='text'
                            name='nick'
                            defaultValue={auth.nick}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='bio'>Bio</label>
                        <textarea name='bio' defaultValue={auth.bio} />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='email'>Email</label>
                        <input
                            type='email'
                            name='email'
                            defaultValue={auth.email}
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='password'>Password</label>
                        <input type='password' name='password' />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='avatar'>Avatar</label>
                        <div className='general-info__container-avatar'>
                            <img
                                src={avatarUser}
                                className='container-avatar__img'
                                alt='profile picture'
                                id='avatar'
                            />
                        </div>
                        <br />
                        <input type='file' name='file0' id='picture' />
                    </div>
                    <br />
                    <input
                        type='submit'
                        value='Update'
                        className='btn btn-success'
                    />
                </form>
                <br />
            </div>
        </>
    );
};
