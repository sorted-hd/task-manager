const dotenv = require('dotenv');
const path = require('path');
dotenv.config({ path: path.join(__dirname, './dev.env') });

module.exports = {
    PORT: process.env.PORT,
    TOKEN: process.env.TOKEN,
    CONNECTION_URL: process.env.CONNECTION_URL,
    DATABASE_NAME: process.env.DATABASE_NAME,
    SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
    EMAIL_FROM: process.env.EMAIL_FROM
};
