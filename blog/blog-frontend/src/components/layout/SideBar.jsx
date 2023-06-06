import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

export const SideBar = () => {
    const redirect = useNavigate();

    const makeSearch = (e) => {
        e.preventDefault();
        const mySearch = e.target.search_field.value;
        redirect('/search/' + mySearch, { replace: true });
    };

    return (
        <aside className='aside'>
            <div className='search'>
                <h3 className='title'>Search</h3>
                <form onSubmit={makeSearch}>
                    <input type='text' name='search_field' />
                    <input type='submit' value='Search' id='search' />
                </form>
            </div>
        </aside>
    );
};
