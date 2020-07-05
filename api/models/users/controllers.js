const express = require('express');
const crypto = require('crypto');

const UsersService = require('./services.js');
const {
    validateFields
} = require('../../utils');
const {
    ServerError
} = require('../../errors');
const {
    sendMail
} = require('../../mail/services')

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const {
        username,
        email,
        fullname,
        password
    } = req.body;

    // validare de campuri
    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'username'
            },
            email: {
                value: email,
                type: 'email'
            },
            fullname: {
                value: fullname,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        let activationCode = crypto.randomBytes(32).toString('hex');

        let id = await UsersService.register(username, email, fullname, password, activationCode);

        console.log(id);
        const message = {
            from: process.env.MAIL_USER,
            to: email,
            subject: 'Activate your BugTrap account',
            html: '<p>Click <a href="http://localhost:3001/activate/' + id + '/' + activationCode + '">here</a> to activate</p>'
        };

        sendMail(message);

        res.status(201).end();
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }
});

router.post('/login', async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    try {
        const fieldsToBeValidated = {
            username: {
                value: username,
                type: 'alpha'
            },
            password: {
                value: password,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        const token = await UsersService.authenticate(username, password);

        res.status(200).json(token);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }

})

router.put('/activate/:id/:code', async (req, res, next) => {
    const {
        id,
        code
    } = req.params;

    try {
        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'int'
            },
            code: {
                value: code,
                type: 'ascii'
            }
        };

        validateFields(fieldsToBeValidated);

        const rows = await UsersService.activate(parseInt(id), code);

        if (rows === 0) {
            throw new ServerError('Eroare la activare!', 500)
        }

        res.status(200);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }

})

router.get('/all', async (req, res, next) => {
    try {
        const users = await UsersService.getAll();

        res.status(200).json(users);
    } catch (err) {
        // daca primesc eroare, pasez eroarea mai departe la handler-ul de errori declarat ca middleware in start.js 
        next(err);
    }

})

module.exports = router;