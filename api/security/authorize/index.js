const PermissionsService = require('../../models/permissions/services.js');

const {
    ServerError
} = require('../../errors');


const authorizePermissions = (errorMessage, ...permissions) => {
    return async (req, res, next) => {
        const {
            projectId
        } = req.state;
    
        if (!!req.state.decoded || !!req.state.decoded.userId) {
            let userPerms = await PermissionsService.getPermissionsForUserOnProject(
                parseInt(req.state.decoded.userId), parseInt(projectId)
            );

            // check for any missing permission
            for (let perm of permissions) {
                if (userPerms.filter((userPerm) => perm.is(userPerm['permission'])).length == 0) {
                    next(new ServerError(errorMessage, 401));
                }
            }

        // no jwt or corrupted
        } else {
            next(new ServerError(errorMessage, 401));
        }

        return next();
    }
};

module.exports = {
    authorizePermissions
}