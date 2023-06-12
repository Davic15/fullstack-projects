import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import useAuth from '../../hooks/useAuth';
import { PublicationList } from '../publication/PublicationList';

export const Feed = () => {
    const [avatarUser, setAvatarUser] = useState('');
    const [publications, setPublications] = useState([]);
    const [more, setMore] = useState(true);
    const [page, setPage] = useState(1);
    const { auth } = useAuth();
    const params = useParams();

    /*useEffect(() => {
        getAvatar();
    }, [auth.image]);*/

    useEffect(() => {
        getPublications(1, false);
    }, []);

    const getPublications = async (nextPage = 1, showNews = false) => {
        if (showNews) {
            setPublications([]);
            setPage([]);
            nextPage = 1;
        }
        const request = await fetch(
            Global.url + 'publication/feed/' + nextPage,
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
            if (!showNews && publications.length >= 1) {
                newPublications = [...publications, ...data.publications];
            }

            setPublications(newPublications);

            if (
                !showNews &&
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
            <header className='content__header'>
                <h1 className='content__title'>Timeline</h1>
                <button
                    className='content__button'
                    onClick={() => getPublications(1, true)}
                >
                    New posts
                </button>
            </header>

            <PublicationList
                publications={publications}
                page={page}
                setPage={setPage}
                more={more}
                setMore={setMore}
                getPublications={getPublications}
            />
        </>
    );
};
