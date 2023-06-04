const mongoose = require('mongoose');

const connectToDB = async () => {
    try {
        mongoose.set('strictQuery', true);
        mongoose
            .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
            .then(() => console.log('mongoose Connected!'));
    } catch (error) {
        console.log(error);
        console.log('mongoose Error');
    }
};

module.exports = connectToDB;
