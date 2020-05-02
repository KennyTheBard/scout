const express = require('express');

const PermissionsService = require('./services.js');
const {
    authorizePermissions
} = require('../../security/authorize/index.js');
const {
    permissions,
    isValidPermission
} = require('./permissions.js');


const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/:userId/:projectId',
            authorizePermissions(
                permissions.GRANT_VIEW_PROJECT,
                permissions.GRANT_UPDATE_PROJECT_NAME,
                permissions.GRANT_UPDATE_PROJECT_CODE,
                permissions.GRANT_DELETE_PROJECT,
                permissions.GRANT_CREATE_TASK,
                permissions.GRANT_VIEW_TASK,
                permissions.GRANT_DELETE_TASK,
                permissions.GRANT_UPDATE_TASK_DESCRIPTION,
                permissions.GRANT_UPDATE_TASK_STATUS,
            ),
            async (req, res, next) => {
    const {
        userId,
        projectId
    } = req.params;
    const {
        permission
    } = req.body;

    try {
        validateFields({
            userId: {
                value: userId,
                type: 'int'
            },
            projectId: {
                value: projectId,
                type: 'int'
            }
        });

        isValidPermission(permission);

        await PermissionsService.givePermissionToUserOnProject(
            permission, parseInt(userId), parseInt(projectId)
        );
        res.status(201).end();
    } catch (err) {
        next(err);
    }
    
});

router.get('/:userId/:projectId', async (req, res, next) => {
    const {
        userId,
        projectId
    } = req.params;

    try {
        validateFields({
            userId: {
                value: userId,
                type: 'int'
            },
            projectId: {
                value: projectId,
                type: 'int'
            }
        });

        const perm = await PermissionsService.getPermissionsForUserOnProject(
            parseInt(userId), parseInt(projectId)
        );
        res.json(perm);
    } catch (err) {
        next(err);
    }
});

module.exports = router;