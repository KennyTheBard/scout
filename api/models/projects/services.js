const {
    query
} = require('../../data');

const add = async (name) => {
    const rows = await query('INSERT INTO projects (name) VALUES ($1) RETURNING *', [name]);
    return rows;
};

const getAll = async () => {
    return await query('SELECT * FROM projects');
};

const getById = async (id) => {
    return await query('SELECT * FROM projects WHERE id = $1', [id]);
};

const updateById = async (id, name) => {
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