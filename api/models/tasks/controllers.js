const express = require('express');

const Security = require('../../security/Jwt/index.js');
const TasksService = require('./services.js');
const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/', Security.authorizeAdminOnly, async (req, res, next) => {
    const {
        code,
        project_id,
        description,
        status
    } = req.body;

    try {
        validateFields({
            code: {
                value: code,
                type: 'alpha',
                length: 4
            },
            project_id: {
                value: project_id,
                type: 'int'
            },
            description: {
                value: description,
                type: 'alpha'
            },
            status: {
                value: status,
                type: 'alpha'
            },
        });

        await TasksService.add(code, project_id, description, status);
        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', async (req, res, next) => {
    try {
        const tasks = await TasksService.getAll();
        res.json(tasks);
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

        const task = await TasksService.getById(parseInt(id));
        res.json(task);
    } catch (err) {
        next(err);
    }
});

router.put('/:id', Security.authorizeAdminOnly, async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        code,
        project_id,
        description,
        status
    } = req.body;

    try {
        validateFields({
            id: {
                value: id,
                type: 'int'
            },
            code: {
                value: code,
                type: 'alpha',
                length: 4
            },
            project_id: {
                value: project_id,
                type: 'int'
            },
            description: {
                value: description,
                type: 'alpha'
            },
            status: {
                value: status,
                type: 'alpha'
            },
        });

        await TasksService.updateById(parseInt(id), code, parseInt(project_id), description, status);
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

        await TasksService.deleteById(parseInt(id));
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;