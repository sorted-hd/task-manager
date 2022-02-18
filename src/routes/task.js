const express = require('express');
const Task = require('../models/task');
const auth = require('../middleware/auth');
const router = new express.Router();

router.post('/tasks', auth, async (request, response) => {
    try {
        const task = new Task({
            ...request.body,
            owner: request.user._id
        });
        await task.save();
        response.status(201).send(task);
    } catch (error) {
        response.status(400).send(error);
    }
});

router.get('/tasks', auth, async (request, response) => {
    try {
        // const task = await Task.find({ owner: request.user._id });
        await request.user.populate('tasks');
        response.send(request.user.tasks);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/tasks/:id', auth, async (request, response) => {
    const _id = request.params.id;
    try {
        const task = await Task.findOne({ _id, owner: request.user._id });
        if (!task) {
            return response.status(404).send();
        }
        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.patch('/tasks/:id', auth, async (request, response) => {
    const data = request.body;
    const _id = request.params.id;

    const updates = Object.keys(data);
    const allowedUpdates = ['description', 'completed'];
    const isValidOperation = updates.every((update) =>
        allowedUpdates.includes(update)
    );
    if (!isValidOperation) {
        return response.status(400).send({ error: 'Invalid update' });
    }

    try {
        const task = await Task.findOne({ _id, owner: request.user._id });
        if (!task) {
            return response.status(404).send();
        }

        updates.forEach((update) => (task[update] = data[update]));
        await task.save();

        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete('/tasks/:id', auth, async (request, response) => {
    const _id = request.params.id;
    try {
        const task = await Task.findOneAndDelete({
            _id,
            owner: request.user._id
        });
        if (!task) {
            return response.status(404).send();
        }
        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
