const express = require('express');

const Security = require('../../security/Jwt/index.js');
const PendingTasksService = require('./services.js');
const TasksService = require('../tasks/services.js');

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

router.post('/', async (req, res, next) => {
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
            project_id: {
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

        await PendingTasksService.add(parseInt(projectId), description, status, parseInt(userId));
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

        const tasks = await PendingTasksService.getAllForProject(parseInt(projectId));
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

router.put('/:id',
            authorizePermissions(
                "Nu aveti permisiunea de a accepta acest task.",
                permissions.CREATE_TASK
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
            id: {
                value: id,
                type: 'int'
            },
            project_id: {
                value: projectId,
                type: 'int'
            }
        });

        let task = (await PendingTasksService.getById(parseInt(id), parseInt(projectId)))[0];
        await TasksService.add(task.project_id, task.description, task.status, task.author_id)
        await PendingTasksService.deleteById(parseInt(id), parseInt(projectId));

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;