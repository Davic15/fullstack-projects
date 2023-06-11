import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';

export const People = () => {
    const { auth } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        getUser(1);
    }, []);

    const getUser = async (nextPage = 1) => {
        setLoadingUser(true);
        //* Request
        const request = await fetch(Global.url + 'user/list/' + nextPage, {
            method: 'GET',
            headers: {
                // prettier-ignore
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
                // prettier-ignore
            },
        });
        const data = await request.json();
        console.log(data);

        //* Create state to list them
        if (data.users && data.status === 'success') {
            let newUsers = data.users;

            if (users.length >= 1) {
                newUsers = [...users, ...data.users];
            }
            setUsers(newUsers);
            setFollowing(data.user_following);
            setLoading(false);
            setLoadingUser(false);
            console.log(data.user_following);

            //* Pagination
            if (users.length >= data.total - data.users.length) {
                setMore(false);
            }
        }
    };

    const follow = async (userId) => {
        console.log(userId);
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
        console.log(data);
        //* Check if correct
        if (data.status === 'success') {
            //* Update the following.
            setFollowing([...following, userId]);
        }
    };

    const unfollow = async (id) => {
        console.log(id);
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
            let filterFollowing = following.filter(
                (followingUserId) => id !== followingUserId
            );
            setFollowing(filterFollowing);
        }
    };

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUser(next);
    };

    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>People</h1>
            </header>
            <div className='content__posts'>
                {users.map((user) => {
                    return (
                        <article className='posts__post' key={user._id}>
                            <div className='post__container'>
                                <div className='post__image-user'>
                                    <a href='#' className='post__image-link'>
                                        <img
                                            src={user.image}
                                            className='post__user-image'
                                            alt='profile avatar'
                                        />
                                    </a>
                                </div>

                                <div className='post__body'>
                                    <div className='post__user-info'>
                                        <a href='#' className='user-info__name'>
                                            {user.name} {user.surname}
                                        </a>
                                        <span className='user-info__divider'>
                                            {' '}
                                            |{' '}
                                        </span>
                                        <a
                                            href='#'
                                            className='user-info__create-date'
                                        >
                                            {user.created_at}
                                        </a>
                                    </div>
                                    <h4 className='post__content'>
                                        {user.bio}
                                    </h4>
                                </div>
                            </div>
                            {user._id !== auth._id && (
                                <div className='post__buttons'>
                                    {!following.includes(user._id) && (
                                        <button
                                            className='post__button post__button--green'
                                            onClick={() => follow(user._id)}
                                        >
                                            Follow
                                        </button>
                                    )}
                                    {following.includes(user._id) && (
                                        <button
                                            className='post__button'
                                            onClick={() => unfollow(user._id)}
                                        >
                                            Unfollow
                                        </button>
                                    )}
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
            {loadingUser ? <div>Loading...</div> : ''}
            {more && (
                <div className='content__container-btn'>
                    <button
                        className='content__btn-more-post'
                        onClick={nextPage}
                    >
                        More people
                    </button>
                </div>
            )}
            <br />
        </>
    );
};
