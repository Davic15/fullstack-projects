import { useState } from 'react';

export const useForm = (initialObject = {}) => {
    const [form, setForm] = useState(initialObject);
    const serializeForm = (form) => {
        const formData = new FormData(form);
        const objectFormComplete = {};
        for (let [name, value] of formData) {
            objectFormComplete[name] = value;
        }
        return objectFormComplete;
    };

    const sendData = (e) => {
        e.preventDefault();
        let course = serializeForm(e.target);
        setForm(course);
        document.querySelector('.code').classList.add('sent');
    };

    const changeData = ({ target }) => {
        const { name, value } = target;
        setForm({
            ...form,
            [name]: value,
        });
    };

    return {
        form,
        sendData,
        changeData,
    };
};
