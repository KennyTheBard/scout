const Enum = require('enum')
const {
    ServerError
} = require('../../errors');

const permissionsList = [
    'VIEW_PROJECT', 'GRANT_VIEW_PROJECT',
    'UPDATE_PROJECT', 'GRANT_UPDATE_PROJECT',
    'DELETE_PROJECT', 'GRANT_DELETE_PROJECT',
    
    'CREATE_TASK', 'GRANT_CREATE_TASK',
    'VIEW_TASK', 'GRANT_VIEW_TASK',
    'UPDATE_TASK', 'GRANT_UPDATE_TASK',
    'DELETE_TASK', 'GRANT_DELETE_TASK',
];

const permissions = new Enum(permissionsList, { freeze: true });

const isValidPermission = (permissionName) => {
    if (!permissions.isDefined(permissionName)) {
        throw new ServerError('Numele permisiunii este invalid!', 400);
    }
}

module.exports = {
    permissions,
    permissionsList,
    isValidPermission
};