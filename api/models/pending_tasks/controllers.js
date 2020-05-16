const express = require('express');

const PendingTasksService = require('./services.js');
const TasksService = require('../tasks/services.js');
const UserService = require('../users/services.js');

const {
    authorizePermissions
} = require('../../security/authorize/index.js');
const {
    permissions
} = require('../permissions/permissions.js');


const {
    validateFields
} = require('../../utils');
const {
    isValidStatus
} = require('../statuses/task_status.js');
const {
    pending_statuses
} = require('../statuses/pending_status.js');
const {
    sendMail
} = require('../../mail/services')

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

        const tasks = await PendingTasksService.getAllPendingForProject(parseInt(projectId));
        res.json(tasks);
    } catch (err) {
        next(err);
    }
});

router.put('/accept/:id',
            authorizePermissions(
                "Nu aveti permisiunea de a accepta acest task.",
                permissions.CREATE_TASK
            ),
            async (req, res, next) => {
    const {
        projectId,
        decoded
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
        let user = (await UserService.getById(parseInt(task.author_id)))[0]
        await TasksService.add(task.project_id, task.description, task.status, task.author_id)
        await PendingTasksService.setPendingStatusById(parseInt(id), parseInt(projectId), pending_statuses.ACCEPTED);

        const message = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Your task suggestion has been accepted',
            html: `<p>Your task sugestion (${task.description} - ${task.status}) has been approved by ${decoded.username}</p>`
        };

        sendMail(message);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.put('/decline/:id',
            authorizePermissions(
                "Nu aveti permisiunea de a refuza acest task.",
                permissions.CREATE_TASK
            ),
            async (req, res, next) => {
    const {
        projectId,
        decoded
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
        let user = (await UserService.getById(parseInt(task.author_id)))[0]
        await TasksService.add(task.project_id, task.description, task.status, task.author_id)
        await PendingTasksService.setPendingStatusById(parseInt(id), parseInt(projectId), pending_statuses.DECLINED);

        const message = {
            from: process.env.MAIL_USER,
            to: user.email,
            subject: 'Your task suggestion has been declined',
            html: `<p>Your task sugestion (${task.description} - ${task.status}) has been declined by ${decoded.username}</p>`
        };

        sendMail(message);

        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;