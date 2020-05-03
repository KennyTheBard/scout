const express = require('express');

const ProjectsService = require('./services.js');
const PermissionService = require('../permissions/services.js');
const TaskService = require('../tasks/services.js');

const {extractPathParam} = require('../../middleware/extract.js');


const {
    authorizePermissions
} = require('../../security/authorize/index.js');
const {
    permissions,
    permissionsList,
} = require('../permissions/permissions.js');

const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/', async (req, res, next) => {
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

        let rows = await ProjectsService.add(name);
        await PermissionService.giveMultiplePermissionsToUserOnProject(permissionsList, req.state.decoded.userId, rows[0].id)

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

router.get('/:projectId', authorizePermissions(permissions.VIEW_PROJECT), async (req, res, next) => {
    const {
        projectId
    } = req.params;

    try {
        validateFields({
            projectId: {
                value: projectId,
                type: 'int'
            }
        });
        const project = await ProjectsService.getById(parseInt(projectId));
        res.json(project);
    } catch (err) {
        next(err);
    }
});

router.put('/:projectId',
            extractPathParam('projectId'), 
            authorizePermissions(
                permissions.UPDATE_PROJECT_NAME,
                permissions.UPDATE_PROJECT_CODE,
            ),
            async (req, res, next) => {
    const {
        projectId
    } = req.params;
    const {
        name
    } = req.body;

    try {
        const fieldsToBeValidated = {
            projectId: {
                value: projectId,
                type: 'int'
            },
            name: {
                value: name,
                type: 'alpha'
            }
        };
        validateFields(fieldsToBeValidated);

        await ProjectsService.updateById(parseInt(projectId), name);
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

router.delete('/:projectId',
                extractPathParam('projectId'), 
                authorizePermissions(
                    permissions.DELETE_PROJECT,
                ),
                async (req, res, next) => {
    const {
        projectId
    } = req.params;

    try {
        validateFields({
            projectId: {
                value: projectId,
                type: 'int'
            }
        });

        // delete references first
        await PermissionService.deleteAllPermissionsByProject(parseInt(projectId));
        await TaskService.deleteAllByProjectId(parseInt(projectId));

        await ProjectsService.deleteById(parseInt(projectId));
        res.status(204).end();
    } catch (err) {
        next(err);
    }
});

module.exports = router;