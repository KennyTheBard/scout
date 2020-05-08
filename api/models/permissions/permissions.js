const Enum = require('enum')
const {
    ServerError
} = require('../../errors');

const permissionsList = [
    'VIEW_PROJECT',
    'UPDATE_PROJECT', 
    'DELETE_PROJECT',

    'CREATE_TASK',
    'VIEW_TASK',
    'UPDATE_TASK',
    'DELETE_TASK',

    'GRANT_PERMISSION'
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