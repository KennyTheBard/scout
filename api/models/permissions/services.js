const {
    query
} = require('../../data');

const add = async (name) => {
    await query('INSERT INTO permissions (name) VALUES ($1)', [value]);
};

const getById = async (id) => {
    return await query('SELECT * FROM permissions WHERE id = $1', [id]);
};


const getAll = async() => {
    return await query('SELECT * FROM permissions');
};

module.exports = {
    add,
    getById,
    getAll
}