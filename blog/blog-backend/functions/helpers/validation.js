const validator = require('validator');

const validateArticle = (parameter) => {
    let validateTitle =
        !validator.isEmpty(parameter.title) &&
        validator.isLength(parameter.title, { min: 5, max: undefined });
    let validateContent = !validator.isEmpty(parameter.content);

    if (!validateTitle || !validateContent) {
        throw new Error('The input is not valid!.');
    }
};

module.exports = { validateArticle };
