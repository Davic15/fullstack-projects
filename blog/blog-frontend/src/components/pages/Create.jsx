import React, { useState } from 'react';
import { Request } from '../../helpers/Request';
import { Global } from '../../helpers/Global';
import { useForm } from '../../hooks/useForm';
import { useNavigate } from 'react-router-dom';

export const Create = () => {
    const { form, sendData, changeData } = useForm();
    const [result, setResult] = useState('no_sent');

    const navigate = useNavigate();

    const saveArticle = async (e) => {
        e.preventDefault();
        // Getting data from the form
        let newArticle = form;

        // Save data in the backend
        const { data, loading } = await Request(
            Global.url + 'create',
            'POST',
            newArticle
        );
        if (data.status === 'success') {
            setResult('saved');
        } else {
            setResult('error');
        }

        // Upload image
        const fileInput = document.querySelector('#picture');
        if (data.status === 'success' && fileInput.files[0]) {
            setResult('saved');
            const formData = new FormData();
            formData.append('picture', fileInput.files[0]);
            const upload = await Request(
                Global.url + 'upload-image/' + data.article._id,
                'POST',
                formData,
                true
            );
            console.log(formData);
            if (upload.data.status === 'success') {
                setResult('saved');
            } else {
                setResult('error');
            }
        }
        navigate('/articles');
    };

    return (
        <div className='jumbo'>
            <h1>Create Article</h1>
            <p>Form to create a new article.</p>
            <strong>{result === 'saved' ? 'Article saved!.' : ''}</strong>
            <strong>
                {result === 'error' ? 'Data provided is not correct!.' : ''}
            </strong>
            {/* Form */}
            <form onSubmit={saveArticle} className='form'>
                <div className='form-group'>
                    <label htmlFor='title'>Title</label>
                    <input type='text' name='title' onChange={changeData} />
                </div>
                <div className='form-group'>
                    <label htmlFor='content'>Content</label>
                    <input type='text' name='content' onChange={changeData} />
                </div>
                <div className='form-group'>
                    <label htmlFor='file'>Image</label>
                    <input type='file' name='picture' id='picture' />
                </div>
                <input type='submit' value='Save' className='btn btn-success' />
            </form>
        </div>
    );
};
