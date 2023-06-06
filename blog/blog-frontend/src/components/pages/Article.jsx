import React, { useState, useEffect } from 'react';
import { Global } from '../../helpers/Global';
import { useParams } from 'react-router-dom';
import { Request } from '../../helpers/Request';

export const Article = () => {
    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(true);
    const params = useParams();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const { data, loading } = await Request(
            Global.url + 'article/' + params.id,
            'GET'
        );

        if (data.status === 'success') {
            setArticle(data.article);
        }
        setLoading(false);
    };

    return (
        <div className='jumbo'>
            {loading ? (
                'Loading...'
            ) : (
                <>
                    <div className='mask'>
                        <img src={article.image} alt={article.title} />
                    </div>
                    <h1>{article.title}</h1>
                    <span>{article.date}</span>
                    <p>{article.content}</p>
                </>
            )}
        </div>
    );
};
