const express = require('express');
const Task = require('../models/task');
const router = new express.Router();

router.post('/tasks', async (request, response) => {
    try {
        const task = new Task(request.body);
        await task.save();
        response.status(201).send(task);
    } catch (error) {
        response.status(400).send(error);
    }
});

router.get('/tasks', async (request, response) => {
    try {
        const task = await Task.find({});
        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.get('/tasks/:id', async (request, response) => {
    const _id = request.params.id;
    try {
        const task = await Task.findById(_id);
        if (!task) {
            return response.status(404).send();
        }
        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.patch('/tasks/:id', async (request, response) => {
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
        const task = await Task.findByIdAndUpdate(_id, data, {
            new: true,
            runValidators: true
        });

        if (!task) {
            return response.status(404).send();
        }

        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.delete('/tasks/:id', async (request, response) => {
    const _id = request.params.id;
    try {
        const task = await Task.findByIdAndDelete(_id);
        if (!task) {
            return response.status(404).send();
        }
        response.send(task);
    } catch (error) {
        response.status(500).send(error);
    }
});

module.exports = router;
