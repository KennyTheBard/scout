const {
    query
} = require('../../data');

const add = async (projectId, description, status, userId) => {
    await query('INSERT INTO pending_tasks (project_id, description, status, author_id) ' +
    'VALUES ($1, $2, $3, $4)', [projectId, description, status, userId]);
};

const getAllForProject = async (projectId) => {
    return await query('SELECT * FROM pending_tasks WHERE project_id = $1', [projectId]);
};

const getById = async (id, projectId) => {
    return await query('SELECT * FROM pending_tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
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
    getById,
    deleteById,
    deleteAllByProjectId
}