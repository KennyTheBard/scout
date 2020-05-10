const {
    ServerError
} = require('../errors');

const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
       user: process.env.MAIL_USER,
       pass: process.env.MAIL_PASS
    }
});

const sendMail = (message) => {
    transport.sendMail(message, function (err, info) {
        if (err) {
            throw new ServerError('Eroare la trimiterea mailului de activate!', 500);;
        } else {
            console.log(info);
            console.log(message.html);
        }
     });
}

module.exports = {
    sendMail
}