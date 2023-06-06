import React from 'react';
import { Link } from 'react-router-dom';
import { Global } from '../../helpers/Global';
import { Request } from '../../helpers/Request';

export const List = ({ articles, setArticles }) => {
    const deleteArticle = async (id) => {
        let { data } = await Request(Global.url + 'article/' + id, 'DELETE');
        if (data.status === 'success') {
            const updateArticles = articles.filter(
                (article) => article._id !== id
            );
            setArticles(updateArticles);
        }
    };
    return articles.map((article) => {
        return (
            <article className='article-item' key={article._id}>
                <div className='mask'>
                    <img src={article.image} alt={article.title} />
                </div>
                <div className='data'>
                    <h3 className='title'>
                        <Link to={'/article/' + article._id}>
                            {article.title}
                        </Link>
                    </h3>
                    <p className='description'>{article.content}</p>
                    <Link to={'/edit/' + article._id} className='edit'>
                        Edit
                    </Link>
                    <button
                        className='delete'
                        onClick={() => deleteArticle(article._id)}
                    >
                        Delete
                    </button>
                </div>
            </article>
        );
    });
};
