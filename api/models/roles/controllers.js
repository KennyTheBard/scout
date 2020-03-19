const express = require('express');

const UsersService = require('./services.js');
const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/roles', async (req, res, next) => {
    const {
        value
    } = req.body;

    try {
        validateFields({
            value: {
                value,
                type: 'alpha'
            }
        });

        await UsersService.addRole(value);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
    
});

// ruta pt verificarea datelor
router.get('/roles', async (req, res, next) => {
    res.json(await UsersService.getRoles());
});

module.exports = router;