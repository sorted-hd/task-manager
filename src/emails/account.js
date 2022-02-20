const sgMail = require('@sendgrid/mail');
const { EMAIL_FROM, SENDGRID_API_KEY } = require('../config/config');

sgMail.setApiKey(SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    const emailObj = {
        to: email,
        from: EMAIL_FROM,
        subject: 'Thanks for joining in!',
        text: `Welcome to the app, ${name}. We hope you really enjoy being part of the family.`
    };

    sgMail.send(emailObj);
};

const sendDeleteEmail = (email, name) => {
    const emailObj = {
        to: email,
        from: EMAIL_FROM,
        subject: 'We are sad to see go :(',
        text: `Thanks for being a value member of the family, ${name}. We wish you all the best.`
    };

    sgMail.send(emailObj);
};

module.exports = {
    sendWelcomeEmail,
    sendDeleteEmail
};
