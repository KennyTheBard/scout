const express = require('express');

const RolesService = require('./services.js');
const Security = require('../../security/Jwt/index.js');

const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/roles', Security.authorizeAdminOnly, async (req, res, next) => {
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

        await RolesService.addRole(value);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
    
});

router.get('/:id', async (req, res, next) => {
    const {
        id
    } = req.params;

    try {
        validateFields({
            id: {
                value: id,
                type: 'int'
            }
        });
        const role = await RolesService.getById(parseInt(id));
        res.json(role);
    } catch (err) {
        next(err);
    }
});

router.get('/roles', async (req, res, next) => {
    res.json(await RolesService.getRoles());
});

module.exports = router;