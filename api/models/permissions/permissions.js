const Enum = require('enum')

const permissions = new Enum([
        'VIEW_PROJECT', 'GRANT_VIEW_PROJECT',
        'UPDATE_PROJECT_NAME', 'GRANT_UPDATE_PROJECT_NAME',
        'UPDATE_PROJECT_CODE', 'GRANT_UPDATE_PROJECT_CODE',
        'DELETE_PROJECT', 'GRANT_DELETE_PROJECT',
        
        'CREATE_TASK', 'GRANT_CREATE_TASK',
        'VIEW_TASK', 'GRANT_VIEW_TASK',
        'UPDATE_TASK_DESCRIPTION', 'GRANT_UPDATE_TASK_DESCRIPTION',
        'UPDATE_TASK_STATUS', 'GRANT_UPDATE_TASK_STATUS',
        'DELETE_TASK', 'GRANT_DELETE_TASK',
    ],
    { freeze: true });

const isValidPermission = (permissionName) => {
    if (!permissions.isDefined(permissionName)) {
        throw new ServerError('Numele permisiunii este invalid!', 400);
    }
}

module.exports = {
    permissions,
    isValidPermission
};