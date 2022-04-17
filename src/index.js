const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const { PORT } = require('./config/config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerConfig = require('./swagger.json');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Task Manager API',
            version: '1.0.0',
            description: 'An Express Task Manager API'
        },
        servers: [
            {
                url: 'http://localhost:3000'
            },
            {
                url: 'https://task-app-hd.herokuapp.com/'
            }
        ]
    },
    apis: ['./routes/*.js']
};

// const specs = swaggerJsDoc(swaggerConfig);

const app = express();

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerConfig));

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});
