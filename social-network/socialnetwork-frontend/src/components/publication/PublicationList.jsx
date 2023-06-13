import React from 'react';
import { Global } from '../../helpers/Global';
import { Link } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import ReactTimeAgo from 'react-time-ago';

export const PublicationList = ({
    publications,
    getPublications,
    page,
    setPage,
    more,
    setMore,
}) => {
    const { auth } = useAuth();
    const nextPage = () => {
        let next = page + 1;
        setPage(next);
        getPublications(next);
    };

    const deletePublication = async (publicationId) => {
        const request = await fetch(
            Global.url + 'publication/remove/' + publicationId,
            {
                method: 'DELETE',
                headers: {
                    // prettier-ignore
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                    // prettier-ignore
                },
            }
        );

        const data = await request.json();

        setPage(1);
        setMore(true);
        getPublications(1, true);
    };
    return (
        <>
            {' '}
            <div className='content__posts'>
                {publications.map((publication) => {
                    return (
                        <article className='posts__post' key={publication._id}>
                            <div className='post__container'>
                                <div className='post__image-user'>
                                    <Link
                                        to={
                                            '/social/profile/' +
                                            publication.user._id
                                        }
                                        className='post__image-link'
                                    >
                                        <img
                                            src={publication.user.image}
                                            className='post__user-image'
                                            alt='profile avatar'
                                        />
                                    </Link>
                                </div>

                                <div className='post__body'>
                                    <div className='post__user-info'>
                                        <Link
                                            to={
                                                '/social/profile/' +
                                                publication.user._id
                                            }
                                            className='user-info__name'
                                        >
                                            {publication.user.name +
                                                ' ' +
                                                publication.user.surname}
                                        </Link>
                                        <span className='user-info__divider'>
                                            {' '}
                                            |{' '}
                                        </span>
                                        <Link
                                            to={
                                                '/social/profile/' +
                                                publication.user._id
                                            }
                                            className='user-info__create-date'
                                        >
                                            <ReactTimeAgo
                                                date={
                                                    new Date(
                                                        publication.created_at
                                                    )
                                                }
                                                locale='en-US'
                                            />
                                        </Link>
                                    </div>
                                    <h4 className='post__content'>
                                        {publication.text}
                                    </h4>
                                    {publication.file && (
                                        <img
                                            src={publication.file}
                                            alt='post'
                                        />
                                    )}
                                </div>
                            </div>
                            {auth._id === publication.user._id && (
                                <div className='post__buttons'>
                                    <button
                                        className='post__button'
                                        onClick={() =>
                                            deletePublication(publication._id)
                                        }
                                    >
                                        <i className='fa-solid fa-trash-can'></i>
                                    </button>
                                </div>
                            )}
                        </article>
                    );
                })}
            </div>
            {more && (
                <div className='content__container-btn'>
                    <button
                        className='content__btn-more-post'
                        onClick={nextPage}
                    >
                        Load more posts
                    </button>
                </div>
            )}
        </>
    );
};
