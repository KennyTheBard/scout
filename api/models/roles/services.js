const {
    query
} = require('../../data');

const addRole = async (value) => {
    await query('INSERT INTO roles (value) VALUES ($1)', [value]);
};

const getById = async (id) => {
    return await query('SELECT * FROM roles WHERE id = $1', [id]);
};

const getRoles = async() => {
    return await query('SELECT * FROM roles');
};

module.exports = {
    addRole,
    getRoles
}