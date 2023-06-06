import React, { useState, useEffect } from 'react';
import { useForm } from '../../hooks/useForm';
import { useParams } from 'react-router-dom';
import { Request } from '../../helpers/Request';
import { Global } from '../../helpers/Global';
import { useNavigate } from 'react-router-dom';

export const Edit = () => {
    const [article, setArticle] = useState([]);
    const { form, sendData, changeData } = useForm({});
    const [result, setResult] = useState('no_sent');

    const navigate = useNavigate();

    const params = useParams();

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const { data } = await Request(
            Global.url + 'article/' + params.id,
            'GET'
        );
        if (data.status === 'success') {
            setArticle(data.article);
        }
    };

    const editArticle = async (e) => {
        e.preventDefault();

        // Get data from the form
        let newArticle = form;

        // Keep previous values if they are null
        if (newArticle.title === null) {
            newArticle.title = article.title;
        }
        if (newArticle.content === null) {
            newArticle.content = article.content;
        }
        if (newArticle.image === null) {
            newArticle.image = article.image;
        }

        // Save data in the backend
        const { data, loading } = await Request(
            Global.url + 'article/' + params.id,
            'PUT',
            newArticle
        );
        if (data.status === 'success') {
            setResult('saved');
        } else {
            setResult('error');
        }

        // Upload image
        const fileInput = document.querySelector('#picture');
        if (data.status === 'success') {
            if (fileInput.isDefaultNamespace.length >= 1) {
                const formData = new FormData();
                formData.append('picture', fileInput.files[0]);
                const upload = await Request(
                    Global.url + 'upload-image/' + data.article._id,
                    'POST',
                    formData,
                    true
                );
                if (upload.data.status === 'success') {
                    setResult('saved');
                } else {
                    setResult('error');
                }
            }
            setResult('saved');
        } else {
            setResult('error');
        }

        navigate('/articles');
    };

    return (
        <div className='jumbo'>
            <h1>Edit Article</h1>
            <p>Form to edit: {article.title}</p>
            <strong>{result === 'saved' ? 'Article saved!.' : ''}</strong>
            <strong>
                {result === 'error' ? 'Data provided is not correct!.' : ''}
            </strong>
            {/* Form */}
            <form onSubmit={editArticle} className='form'>
                <div className='form-group'>
                    <label htmlFor='title'>Title</label>
                    <input
                        type='text'
                        name='title'
                        onChange={changeData}
                        defaultValue={article.title}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='content'>Content</label>
                    <input
                        type='text'
                        name='content'
                        onChange={changeData}
                        defaultValue={article.content}
                    />
                </div>
                <div className='form-group'>
                    <label htmlFor='file'>Image</label>
                    <div className='mask'>
                        <img src={article.image} alt={article.title} />
                    </div>
                    <input type='file' name='picture' id='picture' />
                </div>
                <input type='submit' value='Save' className='btn btn-success' />
            </form>
        </div>
    );
};
