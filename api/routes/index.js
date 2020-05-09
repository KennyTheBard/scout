const Router = require('express')();

const Security = require('../security/Jwt/index.js');

const {extractPathParam} = require('../middleware/extract.js');

const UsersController = require('../models/users/controllers.js');
const PermissionsController = require('../models/permissions/controllers.js');
const ProjectsController = require('../models/projects/controllers.js');
const TasksController = require('../models/tasks/controllers.js');
const PendingTasksController = require('../models/pending_tasks/controllers.js');

const {
    authorizePermissions
} = require('../security/authorize/index.js');
const {
    permissions
} = require('../models/permissions/permissions.js');

// no authorization needed to register or login
Router.use('/users', UsersController);

Router.use('/permissions', Security.authorizeAndExtractToken, PermissionsController);
Router.use('/projects', Security.authorizeAndExtractToken, ProjectsController);
Router.use('/:projectId/tasks', Security.authorizeAndExtractToken,
                                extractPathParam('projectId'),
                                authorizePermissions(
                                    "Nu aveti permisiunea de a vizualiza acest proiect.",
                                    permissions.VIEW_PROJECT
                                ),
                                TasksController);
Router.use('/:projectId/pending-tasks', Security.authorizeAndExtractToken,
                                extractPathParam('projectId'),
                                authorizePermissions(
                                    "Nu aveti permisiunea de a vizualiza acest proiect.",
                                    permissions.VIEW_PROJECT
                                ),
                                PendingTasksController);

module.exports = Router;