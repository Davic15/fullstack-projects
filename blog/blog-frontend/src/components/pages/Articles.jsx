import React, { useState, useEffect } from 'react';
import { Request } from '../../helpers/Request';
import { Global } from '../../helpers/Global';
import { List } from './List';

export const Articles = () => {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const { data, loading } = await Request(Global.url + 'articles', 'GET');
        if (data.status === 'success') {
            setArticles(data.articles);
        }
        setLoading(false);
    };

    return (
        <>
            {loading ? (
                'Loading...'
            ) : articles.length >= 1 ? (
                <List articles={articles} setArticles={setArticles} />
            ) : (
                <h1>No articles were found!.</h1>
            )}
        </>
    );
};
