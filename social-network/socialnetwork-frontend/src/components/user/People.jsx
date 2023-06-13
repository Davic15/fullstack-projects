import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from './UserList';

export const People = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        getUsers(1);
    }, []);

    const getUsers = async (nextPage = 1) => {
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

            //* Pagination
            if (users.length >= data.total - data.users.length) {
                setMore(false);
            }
        }
    };

    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>People</h1>
            </header>
            <UserList
                users={users}
                getUsers={getUsers}
                following={following}
                setFollowing={setFollowing}
                page={page}
                setPage={setPage}
                more={more}
                loadingUser={loadingUser}
            />

            <br />
        </>
    );
};
