const {
    query
} = require('../../data');

const add = async (code, projectId, description, status) => {
    await query('INSERT INTO tasks (code, project_id, description, status) ' +
    'VALUES ($1, $2, $3, $4)', [code, projectId, description, status]);
};

const getAllForProject = async (projectId) => {
    return await query('SELECT * FROM tasks WHERE project_id = $1', [projectId]);
};

const getById = async (id, projectId) => {
    return await query('SELECT * FROM tasks WHERE id = $1 AND project_id = $2', [id, projectId]);
};

const updateById = async (id, code, projectId, description, status) => {
    await query('UPDATE tasks SET code = $1, project_id = $2, description = $3, '+
     'status = $4 WHERE id = $5', [code, projectId, description, status, id]);
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