const {
    query
} = require('../../data');

const add = async (projectId, description, status, userId) => {
    await query('INSERT INTO pending_tasks (project_id, description, status, pending_status, author_id) ' +
    'VALUES ($1, $2, $3, \'PENDING\', $4)', [projectId, description, status, userId]);
};

const getAllForProject = async (projectId) => {
    return await query('SELECT * FROM pending_tasks WHERE project_id = $1', [projectId]);
};

const getAllPendingForProject = async (projectId) => {
    return await query('SELECT p.id, p.description, p.status, u.fullname AS author, u.email AS author_email' + 
    'FROM pending_tasks p JOIN users u ON p.author_id = u.id ' + 
    'WHERE project_id = $1 AND pending_status = \'PENDING\'', [projectId]);
};

const getById = async (id, projectId) => {
    return await query('SELECT * FROM pending_tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
};

const setPendingStatusById = async (id, projectId, pending_status) => {
    return await query('UPDATE pending_tasks SET pending_status = $3 WHERE id = $1 AND project_id = $2', [id, projectId, pending_status]);
};

const deleteById = async (id, projectId) => {
    await query('DELETE FROM pending_tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
};

const deleteAllByProjectId = async (projectId) => {
    await query('DELETE FROM pending_tasks WHERE project_id = $1', [projectId]);
};

module.exports = {
    add,
    getAllForProject,
    getAllPendingForProject,
    getById,
    setPendingStatusById,
    deleteById,
    deleteAllByProjectId
}