const Router = require('express')();

const Security = require('../security/Jwt/index.js');

const {extractPathParam} = require('../middleware/extract.js');

const UsersController = require('../models/users/controllers.js');
const PermissionsController = require('../models/permissions/controllers.js');
const ProjectsController = require('../models/projects/controllers.js');
const TasksController = require('../models/tasks/controllers.js');


// no authorization needed to register or login
Router.use('/users', UsersController);

Router.use('/permissions', Security.authorizeAndExtractToken, PermissionsController);
Router.use('/projects', Security.authorizeAndExtractToken, ProjectsController);
Router.use('/:projectId/tasks', Security.authorizeAndExtractToken, extractPathParam('projectId'), TasksController);

module.exports = Router;