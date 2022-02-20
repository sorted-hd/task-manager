const auth = require('../middleware/auth');
const express = require('express');
const User = require('../models/user');
const multer = require('multer');
const sharp = require('sharp');
const { sendWelcomeEmail, sendDeleteEmail } = require('../emails/account');

const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb('Please upload an Image');
        }

        cb(undefined, true);
    }
});

const router = new express.Router();

router.post('/users', async (request, response) => {
    try {
        const user = new User(request.body);
        await user.save();
        const token = await user.generateAuthToken();
        sendWelcomeEmail(user.email, user.name);
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
        sendDeleteEmail(request.user.email, request.user.name);
        response.send(request.user);
    } catch (error) {
        response.status(500).send(error);
    }
});

router.post(
    '/users/me/avatar',
    auth,
    upload.single('avatar'),
    async (request, response) => {
        const buffer = await sharp(request.file.buffer)
            .resize({ width: 250, height: 250 })
            .png()
            .toBuffer();

        request.user.avatar = buffer;
        await request.user.save();
        response.send();
    },
    (error, request, response, next) => {
        response.status(400).send({ error });
    }
);

router.delete('/users/me/avatar', auth, async (request, response) => {
    try {
        request.user.avatar = undefined;
        await request.user.save();
        response.send();
    } catch (error) {
        response.status(400).send({ error });
    }
});

router.get('/users/:id/avatar', async (request, response) => {
    try {
        const user = await User.findById(request.params.id);

        if (!user || !user.avatar) {
            throw new Error();
        }

        response.set('Content-Type', 'image/png');
        response.send(user.avatar);
    } catch (error) {
        response.status(404).send();
    }
});

module.exports = router;
