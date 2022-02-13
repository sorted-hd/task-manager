const express = require('express');
const User = require('../models/user');

const router = new express.Router();

router.post('/users', async (request, response) => {
    try {
        const user = new User(request.body);
        await user.save();
        response.status(201).send(user);
    } catch (error) {
        response.status(400).send(error);
    }
});

router.get('/users', async (request, response) => {
    try {
        const users = await User.find({});
        response.send(users);
    } catch (error) {
        response.status(500).send();
    }
});

router.get('/users/:id', async (request, response) => {
    const _id = request.params.id;
    try {
        const user = await User.findById(_id);
        if (!user) {
            return response.status(404).send();
        }
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.patch('/users/:id', async (request, response) => {
    const updates = Object.keys(request.body);
    const allowedUpdates = ['name', 'email', 'password', 'age'];
    const isValidOperation = updates.every((update) => {
        return allowedUpdates.includes(update);
    });

    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid updates' });
    }

    try {
        const _id = request.params.id;
        const data = request.body;
        const user = await User.findByIdAndUpdate(_id, data, {
            new: true,
            runValidators: true
        });

        if (!user) {
            return response.status(404).send();
        }

        response.send(user);
    } catch (error) {
        response.status(400).send(error);
    }
});

router.delete('/users/:id', async (request, response) => {
    const _id = request.params.id;
    try {
        const user = await User.findByIdAndDelete(_id);
        if (!user) {
            return response.status(404).send();
        }
        response.send(user);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
