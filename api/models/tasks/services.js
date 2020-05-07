const {
    query
} = require('../../data');

const add = async (projectId, description, status) => {
    await query('INSERT INTO tasks (project_id, description, status) ' +
    'VALUES ($1, $2, $3)', [projectId, description, status]);
};

const getAllForProject = async (projectId) => {
    return await query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
};

const getById = async (id, projectId) => {
    return await query('SELECT * FROM tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
};

const updateById = async (id, projectId, description, status) => {
    await query('UPDATE tasks SET project_id = $1, description = $2, '+
     'status = $3 WHERE id = $4', [projectId, description, status, id]);
};

const deleteById = async (id, projectId) => {
    await query('DELETE FROM tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
};

const deleteAllByProjectId = async (projectId) => {
    await query('DELETE FROM tasks WHERE project_id = $1', [projectId]);
};

module.exports = {
    add,
    getAllForProject,
    getById,
    updateById,
    deleteById,
    deleteAllByProjectId
}