const Router = require('express')();

const Security = require('../security/Jwt/index.js');

const UsersController = require('../models/users/controllers.js');
const RolesController = require('../models/roles/controllers.js');
const ProjectsController = require('../models/projects/controllers.js');
const TasksController = require('../models/tasks/controllers.js');


// no authorization needed to register or login
Router.use('/users', UsersController);

Router.use('/roles', Security.authorizeAndExtractToken, RolesController);
Router.use('/projects', Security.authorizeAndExtractToken, ProjectsController);
Router.use('/tasks', Security.authorizeAndExtractToken, TasksController);

module.exports = Router;