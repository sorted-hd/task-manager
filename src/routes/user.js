const auth = require('../middleware/auth');
const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (request, response) => {
    try {
        const user = new User(request.body);
        await user.save();
        const token = await user.generateAuthToken();
        response.status(201).send({ user, token });
    } catch (error) {
        response.status(400).send(error);
    }
});

router.post('/users/login', async (request, response) => {
    try {
        const data = request.body;
        const user = await User.findByCredentials(data.email, data.password);
        const token = await user.generateAuthToken();
        response.send({ user, token });
    } catch (error) {
        response.status(400).send();
    }
});

router.post('/users/logout', auth, async (request, response) => {
    try {
        request.user.tokens = request.user.tokens.filter((token) => {
            return token.token !== request.token;
        });
        await request.user.save();
        response.send();
    } catch (error) {
        response.status(500).send();
    }
});

router.post('/users/logout/all', auth, async (request, response) => {
    try {
        request.user.tokens = [];
        await request.user.save();
        response.send();
    } catch (error) {
        response.status(500).send();
    }
});

router.get('/users/me', auth, async (request, response) => {
    const user = request.user;
    response.send(user);
});

router.patch('/users/me', auth, async (request, response) => {
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const data = request.body;
        const user = request.user;
        updates.forEach((update) => (user[update] = data[update]));
        await user.save();

        response.send(user);
    } catch (error) {
        response.status(400).send(error);
    }
});

router.delete('/users/me', auth, async (request, response) => {
    try {
        await request.user.remove();
        response.send(request.user);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
