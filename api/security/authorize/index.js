const PermissionsService = require('../../models/permissions/services.js');

const {
    ServerError
} = require('../../errors');


const authorizePermissions = (...permissions) => {
    return async (req, res, next) => {
        const {
            projectId
        } = req.params;
        
        if (!!req.state.decoded || !!req.state.decoded.userId) {
            let userPerms = await PermissionsService.getPermissionsForUserOnProject(
                parseInt(req.state.decoded.userId), parseInt(projectId)
            );

            // check for any missing permission
            for (let perm in permissions) {
                if (userPerms.indexOf(perm) < 0) {
                    throw new ServerError('Nu aveti permisiune sa executati aceasta actiune!', 401);
                }
            }

        // no jwt or corrupted
        } else {
            throw new ServerError('Nu aveti permisiune sa executati aceasta actiune!', 401);
        }

        return next();
    }
};

module.exports = {
    authorizePermissions
}