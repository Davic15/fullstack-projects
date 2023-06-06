import React from 'react';
import { NavLink } from 'react-router-dom';

export const Navigation = () => {
    return (
        <nav className='nav'>
            <ul>
                <li>
                    <NavLink to='/home'>Home</NavLink>
                </li>
                <li>
                    <NavLink to='/articles'>Articles</NavLink>
                </li>
                <li>
                    <NavLink to='/create'>Create</NavLink>
                </li>
            </ul>
        </nav>
    );
};
