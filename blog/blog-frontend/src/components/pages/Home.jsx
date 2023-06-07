import React from 'react';
import { Link } from 'react-router-dom';

export const Home = () => {
    return (
        <div className='jumbo'>
            <h1>Welcome to my blog developed using React</h1>
            <p>
                Blog developed using the MERN stack (Mongo, Express, React and
                Node)
            </p>
            <Link to='/articles' className='button'>
                More articles
            </Link>
        </div>
    );
};
