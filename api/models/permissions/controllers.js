const express = require('express');

const PermissionsService = require('./services.js');
const Security = require('../../security/Jwt/index.js');

const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/permissions', Security.authorizeAdminOnly, async (req, res, next) => {
    const {
        name
    } = req.body;

    try {
        validateFields({
            name: {
                name,
                type: 'alpha'
            }
        });

        await PermissionsService.add(name);

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
        const perm = await permissions.getById(parseInt(id));
        res.json(perm);
    } catch (err) {
        next(err);
    }
});

router.get('/permissions', async (req, res, next) => {
    res.json(await permissions.getAll());
});

module.exports = router;