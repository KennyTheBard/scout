const Enum = require('enum')

const task_statuses = new Enum(['TODO',
        'SELECTED FOR DEVELOPMENT',
        'IN PROGRESS',
        'READY FOR CODE REVIEW',
        'READY FOR TESTING',
        'DONE'],
    { freeze: true });

const isValidStatus = (statusName) => {
    if (!task_statuses.isDefined(statusName)) {
        throw new ServerError('Numele statusului este invalid!', 400);
    }
}

module.exports = {
    task_statuses,
    isValidStatus
};