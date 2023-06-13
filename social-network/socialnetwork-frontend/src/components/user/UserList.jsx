import React from 'react';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { Link } from 'react-router-dom';
import ReactTimeAgo from 'react-time-ago';

export const UserList = ({
    users,
    getUsers,
    following,
    setFollowing,
    page,
    setPage,
    more,
    loadingUser,
}) => {
    const { auth } = useAuth();
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
            setFollowing([...following, userId]);
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
            let filterFollowing = following.filter(
                (followingUserId) => id !== followingUserId
            );
            setFollowing(filterFollowing);
        }
    };

    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getUsers(next);
    };
    return (
        <>
            <div className='content__posts'>
                {users.map((user) => {
                    return (
                        <article className='posts__post' key={user._id}>
                            <div className='post__container'>
                                <div className='post__image-user'>
                                    <Link
                                        to={'/social/profile/' + user._id}
                                        className='post__image-link'
                                    >
                                        <img
                                            src={user.image}
                                            className='post__user-image'
                                            alt='profile avatar'
                                        />
                                    </Link>
                                </div>

                                <div className='post__body'>
                                    <div className='post__user-info'>
                                        <Link
                                            to={'/social/profile/' + user._id}
                                            className='user-info__name'
                                        >
                                            {user.name} {user.surname}
                                        </Link>
                                        <span className='user-info__divider'>
                                            {' '}
                                            |{' '}
                                        </span>
                                        <Link
                                            to={'/social/profile/' + user._id}
                                            className='user-info__create-date'
                                        >
                                            <ReactTimeAgo
                                                date={new Date(user.created_at)}
                                                locale='en-US'
                                            />
                                        </Link>
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
        </>
    );
};
