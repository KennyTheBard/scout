const express = require('express');

const PermissionsService = require('./services.js');
const {
    authorizePermissions
} = require('../../security/authorize/index.js');
const {
    permissions,
    isValidPermission
} = require('./permissions.js');
const {extractPathParam} = require('../../middleware/extract.js');


const {
    validateFields
} = require('../../utils');

const router = express.Router();

router.post('/:userId/:projectId',
            extractPathParam('projectId'), 
            authorizePermissions(
                permissions.GRANT_PERMISSION,
            ),
            async (req, res, next) => {
    const {
        userId,
        projectId
    } = req.params;
    const {
        permissions
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

        // check if each permission is valid
        for (let permission of permissions) {
            isValidPermission(permission);
        }

        // delete all permissins of said user on said project
        await PermissionsService.deleteAllPermissionsByProjectAndUserId(
            parseInt(userId),
            parseInt(projectId)
        );

        // give new permissions
        for (let permission of permissions) {
            await PermissionsService.givePermissionToUserOnProject(
                permission, parseInt(userId), parseInt(projectId)
            );
        }
       
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