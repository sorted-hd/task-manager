const res = require('express/lib/response');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

const auth = async (request, response, next) => {
    try {
        const token = request.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'thisismynodeproject');

        const user = await User.findOne({
            _id: decoded._id,
            'tokens.token': token
        });

        if (!user) {
            throw new Error();
        }
        request.token = token;
        request.user = user;
        next();
    } catch (error) {
        response.status(401).send({ error: 'Please Authenticate' });
    }
};

module.exports = auth;
