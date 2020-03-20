const {
    query
} = require('../../data');

const add = async (code, project_id, description, status) => {
    await query('INSERT INTO tasks (code, project_id, description, status) ' +
    'VALUES ($1, $2, $3, $4)', [code, project_id, description, status]);
};

const getAll = async () => {
    return await query('SELECT * FROM tasks');
};

const getById = async (id) => {
    return await query('SELECT * FROM tasks WHERE id = $1', [id]);
};

const updateById = async (id, code, project_id, description, status) => {
    await query('UPDATE tasks SET code = $1, project_id = $2, description = $3, '+
     'status = $4 WHERE id = $5', [code, project_id, description, status, id]);
};

const deleteById = async (id) => {
    await query('DELETE FROM tasks WHERE id = $1', [id]);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}