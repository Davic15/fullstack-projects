import React, { useEffect, useState } from 'react';
import { Global } from '../../helpers/Global';
import { UserList } from '../user/UserList';
import { useParams } from 'react-router-dom';
import { GetProfile } from '../../helpers/GetProfile';

export const Followers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [more, setMore] = useState(true);
    const [following, setFollowing] = useState([]);
    const [loadingUser, setLoadingUser] = useState(true);
    const [userProfile, setUserProfile] = useState({});
    const params = useParams();

    useEffect(() => {
        getUsers(1);
        GetProfile(params.userId, setUserProfile);
    }, []);

    const getUsers = async (nextPage = 1) => {
        setLoadingUser(true);

        // Get the userId
        const userId = params.userId;

        //* Request
        const request = await fetch(
            Global.url + 'follow/followers/' + userId + '/' + nextPage,
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

        // Loop and clean follows
        let cleanUsers = [];
        data.follows.forEach((follow) => {
            cleanUsers = [...cleanUsers, follow.user];
        });
        data.users = cleanUsers;

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

    return (
        <>
            <header className='content__header'>
                <h1 className='content__title'>
                    Followers of {userProfile.name} {userProfile.surname}
                </h1>
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
