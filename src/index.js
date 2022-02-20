const express = require('express');
require('./db/mongoose');
const userRouter = require('./routes/user');
const taskRouter = require('./routes/task');
const { PORT } = require('./config/config');

const app = express();

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);
console.log('Testing');
app.listen(PORT, () => {
    console.log(`Server is up on port ${PORT}`);
});
