import React, { useEffect, useState } from 'react';
import avatar from '../../../assets/img/user.png';
import { Global } from '../../../helpers/Global';
import useAuth from '../../../hooks/useAuth';

export const SideBar = () => {
    const { auth, counters } = useAuth();
    const [avatarUser, setAvatarUser] = useState('');
    console.log(auth, counters);

    useEffect(() => {
        getAvatar();
    }, [auth.image]);

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
                            <a href='#' className='container-names__name'>
                                {auth.name} {auth.surname}
                            </a>
                            <p className='container-names__nickname'>
                                {auth.nick}
                            </p>
                        </div>
                    </div>

                    <div className='profile-info__stats'>
                        <div className='stats__following'>
                            <a href='#' className='following__link'>
                                <span className='following__title'>
                                    Following
                                </span>
                                <span className='following__number'>
                                    {counters.following}
                                </span>
                            </a>
                        </div>
                        <div className='stats__following'>
                            <a href='#' className='following__link'>
                                <span className='following__title'>
                                    Followers
                                </span>
                                <span className='following__number'>
                                    {counters.followed}
                                </span>
                            </a>
                        </div>

                        <div className='stats__following'>
                            <a href='#' className='following__link'>
                                <span className='following__title'>
                                    Publications
                                </span>
                                <span className='following__number'>
                                    {counters.publications}
                                </span>
                            </a>
                        </div>
                    </div>
                </div>

                <div className='aside__container-form'>
                    <form className='container-form__form-post'>
                        <div className='form-post__inputs'>
                            <label htmlFor='post' className='form-post__label'>
                                What are you doing?
                            </label>
                            <textarea
                                name='post'
                                className='form-post__textarea'
                            ></textarea>
                        </div>
                        <div className='form-post__inputs'>
                            <label htmlFor='image' className='form-post__label'>
                                Upload your photo
                            </label>
                            <input
                                type='file'
                                name='image'
                                className='form-post__image'
                            />
                        </div>
                        <input
                            type='submit'
                            value='Enviar'
                            className='form-post__btn-submit'
                            disabled
                        />
                    </form>
                </div>
            </div>
        </aside>
    );
};
