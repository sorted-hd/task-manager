const mongoose = require('mongoose');
const { CONNECTION_URL, DATABASE_NAME } = require('../config/config');

mongoose.connect(`${CONNECTION_URL}/${DATABASE_NAME}`, {
    useNewUrlParser: true
});
