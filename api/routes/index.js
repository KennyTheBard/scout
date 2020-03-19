const Router = require('express')();

const Security = require('../security/Jwt/index.js');

const UsersController = require('../models/users/controllers.js');
const RolesController = require('../models/roles/controllers.js');
const AuthorsController = require('../models/authors/controllers.js');

Router.use('/users', UsersController);
Router.use('/roles', UsersController);

Router.use('/authors', Security.authorizeAndExtractToken, AuthorsController);

module.exports = Router;