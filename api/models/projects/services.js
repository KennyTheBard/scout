const {
    query
} = require('../../data');

const add = async (name) => {
    await query('INSERT INTO projects (name) VALUES ($1)', [name]);
};

const getAll = async () => {
    return await query('SELECT * FROM projects');
};

const getById = async (id) => {
    return await query('SELECT * FROM projects WHERE id = $1', [id]);
};

const updateById = async (id, first_name, last_name) => {
    await query('UPDATE projects SET name = $1 WHERE id = $2', [name, id]);
};

const deleteById = async (id) => {
    await query('DELETE FROM projects WHERE id = $1', [id]);
};

module.exports = {
    add,
    getAll,
    getById,
    updateById,
    deleteById
}