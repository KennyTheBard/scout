const express = require('express');

const Security = require('../../security/Jwt/index.js');
const ProjectsService = require('./services.js');
const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/', Security.authorizeAdminOnly, async (req, res, next) => {
    const {
        name
    } = req.body;

    try {
        const fieldsToBeValidated = {
            name: {
                value: name,
                type: 'alpha'
            },
        };
        validateFields(fieldsToBeValidated);

        await ProjectsService.add(name);

        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const projects = await ProjectsService.getAll();
        res.json(projects);
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
        const project = await ProjectsService.getById(parseInt(id));
        res.json(project);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', Security.authorizeAdminOnly, async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        name
    } = req.body;

    try {
        const fieldsToBeValidated = {
            id: {
                value: id,
                type: 'int'
            },
            name: {
                value: name,
                type: 'alpha'
            }
        };
        validateFields(fieldsToBeValidated);

        await ProjectsService.updateById(parseInt(id), name);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id', Security.authorizeAdminOnly, async (req, res, next) => {
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

        await ProjectsService.deleteById(parseInt(id));
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;