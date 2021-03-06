const {
    query
} = require('../../data');

const {
    generateToken,
} = require('../../security/jwt');

const {
    ServerError
} = require('../../errors');

const {
    hash,
    compare
} = require('../../security/password');

const register = async (username, email, fullname, password, activationCode) => {
    // check uniqueness by username
    const usersByUsername = await query(`SELECT u.id, u.password FROM users u
                                WHERE u.username = $1`, [username]);
    if (usersByUsername.length !== 0) {
        throw new ServerError('Exista deja un utilizator cu acest username inregistrat in sistem!', 400);
    }

    // check uniqueness by email
    const usersByEmail = await query(`SELECT u.id, u.password FROM users u
                                WHERE u.email = $1`, [email]);
    if (usersByEmail.length !== 0) {
        throw new ServerError('Exista deja un utilizator cu acest email inregistrat in sistem!', 400);
    }

    let cryptoPass = await hash(password);
    let ret = await query('INSERT INTO users (username, email, fullname, password, activated, activation_code) ' +
        'VALUES ($1, $2, $3, $4, FALSE, $5) RETURNING *', [username, email, fullname, cryptoPass, activationCode]);

    return ret[0].id;
};

const authenticate = async (username, password) => {
    const users = await query(`SELECT u.id, u.email, u.fullname, u.password, u.activated FROM users u
                                WHERE u.username = $1`, [username]);

    if (users.length === 0) {
        throw new ServerError(`Utilizatorul cu username ${username} nu exista in sistem!`, 400);
    }
    const user = users[0];

    // check registration dates
    const check = await compare(password, user.password);
    if (!check) {
        throw new ServerError("Parola incorecta!", 403);
    }

    // check if the account has been activated
    if (!user.activated) {
        throw new ServerError("Contul trebuie activat folosind linkul primit pe email inainte de a il folosi!", 400);
    }

    // generate token payload
    let token = await generateToken({
        userId: user.id,
        username: username,
        email: user.email,
        fullname: user.fullname,
    })

    return token
};

const activate = async (id, activationCode) => {
    let rows = await query(`UPDATE users SET activated = TRUE WHERE id = $1 AND activation_code = $2`, [id, activationCode]);

    return rows
};

const getAll = async () => {
    const users = await query(`SELECT id, username, fullname FROM users`);

    return users
};

const getById = async (id) => {
    const users = await query(`SELECT * FROM users WHERE id = $1`, [id]);

    return users
};

module.exports = {
    register,
    authenticate,
    activate, 
    getAll,
    getById
}