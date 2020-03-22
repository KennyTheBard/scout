const express = require('express');

const UsersService = require('./services.js');
const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/register', async (req, res, next) => {
    const {
        username,
        password
    } = req.body;

    // validare de campuri
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

        await UsersService.register(username, password);

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

module.exports = router;