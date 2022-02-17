const mongoose = require('mongoose');
const { createIndexes } = require('../models/user');

const connectionURL = 'mongodb://127.0.0.1:27017';
const databaseName = 'task-manager-api';

mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true
});
