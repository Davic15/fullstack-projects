import React, { useEffect, useState } from 'react';
import { GetProfile } from '../../helpers/GetProfile';
import { Link, useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Profile = () => {
    const [user, setUser] = useState({});
    const [avatarUser, setAvatarUser] = useState('');
    const [counters, setCounters] = useState({});
    const [iFollow, setIFollow] = useState(false);
    const [publications, setPublications] = useState([]);
    const [more, setMore] = useState(true);
    const [page, setPage] = useState(1);
    const { auth } = useAuth();
    const params = useParams();

    useEffect(() => {
        getAvatar();
    }, [auth.image]);

    useEffect(() => {
        getDataUser();
        getCounters();
        getPublications(1, true);
    }, []);

    useEffect(() => {
        getDataUser();
        getCounters();
        setMore(true);
        getPublications(1, true);
    }, [params]);

    const getDataUser = async () => {
        let dataUser = await GetProfile(params.userId, setUser);
        if (dataUser.following && dataUser.following._id) {
            setIFollow(true);
        }
    };

    // Get the user avatar.
    const getAvatar = async () => {
        const request = await fetch(
            Global.url + 'user/avatar/' + params.userId,
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
    };

    const getCounters = async () => {
        const request = await fetch(
            Global.url + 'user/counters/' + params.userId,
            {
                method: 'GET',
                headers: {
                    // prettier-ignore
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    // prettier-ignore
                },
            }
        );
        const data = await request.json();
        if (data.following) {
            setCounters(data);
        }
    };

    const follow = async (userId) => {
        //* Save Follow in the backed
        const request = await fetch(Global.url + 'follow/save', {
            method: 'POST',
            body: JSON.stringify({ followed: userId }),
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                // prettier-ignore
            },
        });
        const data = await request.json();
        //* Check if correct
        if (data.status === 'success') {
            //* Update the following.
            setIFollow(true);
        }
    };

    const unfollow = async (id) => {
        //* Save Follow in the backed
        const request = await fetch(Global.url + 'follow/unfollow/' + id, {
            method: 'DELETE',
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                // prettier-ignore
            },
        });
        //* Check if correct
        const data = await request.json();

        //* Update the following.
        if (data.status === 'success') {
            setIFollow(false);
        }
    };

    const getPublications = async (nextPage = 1, newProfile = false) => {
        const request = await fetch(
            Global.url + 'publication/user/' + params.userId + '/' + nextPage,
            {
                method: 'GET',
                headers: {
                    // prettier-ignore
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    // prettier-ignore
                },
            }
        );
        const data = await request.json();
        if (data.status === 'success') {
            let newPublications = data.publications;
            if (!newProfile && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            if (newProfile) {
                newPublications = data.publications;
                setMore(true);
                setPage(1);
            }
            setPublications(newPublications);

            if (
                !newProfile &&
                publications.length >= data.total - data.publications.length
            ) {
                setMore(false);
            }

            if (data.pages <= 1) {
                setMore(false);
            }
        }
    };

    return (
        <>
            <header className='aside__profile-info'>
                <div className='profile-info__general-info'>
                    <div className='general-info__container-avatar'>
                        <img
                            src={avatarUser}
                            className='container-avatar__img'
                            alt='profile picture'
                        />
                    </div>

                    <div className='general-info__container-names'>
                        <div className='container-names__name'>
                            <h1>
                                {user.name} {user.surname}
                            </h1>
                            {user._id !== auth._id &&
                                (iFollow ? (
                                    <button
                                        className='content__button content__button--right post__button'
                                        onClick={() => unfollow(user._id)}
                                    >
                                        Unfollow
                                    </button>
                                ) : (
                                    <button
                                        className='content__button content__button--right'
                                        onClick={() => follow(user._id)}
                                    >
                                        Follow
                                    </button>
                                ))}
                        </div>
                        <h2 className='container-names__nickname'>
                            {user.nick}
                        </h2>
                        <p>{user.bio}</p>
                    </div>
                </div>

                <div className='profile-info__stats'>
                    <div className='stats__following'>
                        <Link
                            to={'/social/following/' + user._id}
                            className='following__link'
                        >
                            <span className='following__title'>Following</span>
                            <span className='following__number'>
                                {counters.following || 0}
                            </span>
                        </Link>
                    </div>
                    <div className='stats__following'>
                        <Link
                            to={'/social/followers/' + user._id}
                            className='following__link'
                        >
                            <span className='following__title'>Followers</span>
                            <span className='following__number'>
                                {counters.followed || 0}
                            </span>
                        </Link>
                    </div>

                    <div className='stats__following'>
                        <Link
                            to={'/social/profile/' + user._id}
                            className='following__link'
                        >
                            <span className='following__title'>Posts</span>
                            <span className='following__number'>
                                {counters.publications || 0}
                            </span>
                        </Link>
                    </div>
                </div>
            </header>

            <PublicationList
                publications={publications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                getPublications={getPublications}
            />
            <br />
        </>
    );
};
