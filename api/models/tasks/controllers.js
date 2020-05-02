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
} = require('./status.js');

const router = express.Router();

router.post('/', authorizePermissions(permissions.CREATE_TASK), async (req, res, next) => {
    const {
        projectId
    } = req.state;
    const {
        code,
        description,
        status
    } = req.body;

    try {
        validateFields({
            code: {
                value: code,
                type: 'int'
            },
            project_id: {
                value: projectId,
                type: 'int'
            },
            status: {
                value: status,
                type: 'alpha'
            },
        });

        isValidStatus(status);

        await TasksService.add(code, parseInt(projectId), description, status);
        res.status(201).end();
    } catch (err) {
        next(err);
    }
});

router.get('/', authorizePermissions(permissions.VIEW_PROJECT), async (req, res, next) => {
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

router.get('/:id', authorizePermissions(permissions.VIEW_TASK), async (req, res, next) => {
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
                permissions.UPDATE_TASK_DESCRIPTION,
                permissions.UPDATE_TASK_STATUS,
            ),
            async (req, res, next) => {
    const {
        projectId
    } = req.state;
    const {
        id
    } = req.params;
    const {
        code,
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
                type: 'int'
            },
            project_id: {
                value: projectId,
                type: 'int'
            },
            status: {
                value: status,
                type: 'alpha'
            },
        });

        await TasksService.updateById(parseInt(id), code, parseInt(projectId), description, status);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:id',
                authorizePermissions(
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