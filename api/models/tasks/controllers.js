const express = require('express');

const Security = require('../../security/Jwt/index.js');
const TasksService = require('./services.js');

const {
    authorizePermissions
} = require('../../security/authorize/index.js');
const {
    permissions
} = require('../permissions/permissions.js');
const {
    ServerError
} = require('../../errors/index.js')

const {
    validateFields
} = require('../../utils');
const {
    isValidStatus
} = require('../statuses/status.js');

const router = express.Router();

router.post('/', authorizePermissions(
        "Nu aveti permisiunea de a adauga un task nou pe acest proiect.",
        permissions.CREATE_TASK
    ), async (req, res, next) => {
    const {
        projectId,
        decoded
    } = req.state;
    const {
        userId
    } = decoded;
    const {
        description,
        status
    } = req.body;

    try {
        validateFields({
            projectId: {
                value: projectId,
                type: 'int'
            },
            userId: {
                value: userId,
                type: 'int'
            },
            description: {
                value: description,
                type: 'ascii'
            },
            status: {
                value: status,
                type: 'ascii'
            },
        });

        isValidStatus(status);

        await TasksService.add(parseInt(projectId), description, status, parseInt(userId));
        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', authorizePermissions(
        "Nu aveti permisiunea de a vedea detaliile acestui proiect.",
        permissions.VIEW_PROJECT
    ), async (req, res, next) => {
    const {
        projectId
    } = req.state;

    try {
        validateFields({
            project_id: {
                value: projectId,
                type: 'int'
            },
        });

        const tasks = await TasksService.getAllForProject(parseInt(projectId));
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

router.get('/:id', authorizePermissions(
        "Nu aveti permisiunea de a vizualiza detaliile unui task pe acest proiect.",
        permissions.VIEW_TASK
    ), async (req, res, next) => {
    const {
        projectId
    } = req.state;
    const {
        id
    } = req.params;

    try {
        validateFields({
            id: {
                value: id,
                type: 'int'
            },
            project_id: {
                value: projectId,
                type: 'int'
            },
        });

        const task = await TasksService.getById(parseInt(id), parseInt(projectId));
        res.json(task);
    } catch (err) {
        next(err);
    }
});

router.put('/:id',
            authorizePermissions(
                "Nu aveti permisiunea de a actualiza taskuri pe acest proiect.",
                permissions.UPDATE_TASK
            ),
            async (req, res, next) => {
    const {
        id
    } = req.params;
    const {
        description,
        status
    } = req.body;

    try {
        validateFields({
            id: {
                value: id,
                type: 'int'
            },
            description: {
                value: description,
                type: 'ascii'
            },
            status: {
                value: status,
                type: 'ascii'
            },
        });

        await TasksService.updateById(parseInt(id), description, status);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id',
                authorizePermissions(
                    "Nu aveti permisiunea de a sterge un task de pe acest proiect.",
                    permissions.DELETE_TASK,
                ),
                async (req, res, next) => {
    const {
        projectId
    } = req.state;
    const {
        id
    } = req.params;

    try {
        validateFields({
            project_id: {
                value: projectId,
                type: 'int'
            },
            id: {
                value: id,
                type: 'int'
            }
        });

        await TasksService.deleteById(parseInt(id), parseInt(projectId));
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;