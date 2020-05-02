const {
    query
} = require('../../data');

const givePermissionToUserOnProject = async (permission, userId, projectId) => {
    await query('INSERT INTO permissions_to_users (permission, user_id, project_id) ' +
        'VALUES ($1, $2, $3)', [permission, userId, projectId]);
};

const getPermissionsForUserOnProject = async (userId, projectId) => {
    return await query('SELECT * FROM permissions_to_users WHERE ' +
        'user_id = $1 AND project_id = $2', [userId, projectId]);
};

const giveMultiplePermissionsToUserOnProject = async (permissions, userId, projectId) => {
    for (let permission of permissions) {
        await query('INSERT INTO permissions_to_users (permission, user_id, project_id) ' +
        'VALUES ($1, $2, $3)', [permission, userId, projectId]);
    }
};

const deleteAllPermissionsByProject = async (projectId) => {
    await query('DELETE FROM permissions_to_users WHERE project_id = $1', [projectId]);
};

module.exports = {
    givePermissionToUserOnProject,
    getPermissionsForUserOnProject,
    giveMultiplePermissionsToUserOnProject,
    deleteAllPermissionsByProject
}