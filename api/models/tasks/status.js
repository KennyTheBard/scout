const Enum = require('enum')

const statuses = new Enum(['TODO',
        'SELECTED FOR DEVELOPMENT',
        'IN PROGRESS',
        'READY FOR CODE REVIEW',
        'READY FOR TESTING',
        'DONE'],
    { freeze: true });

const isValidStatus = (statusName) => {
    if (!statuses.isDefined(statusName)) {
        throw new ServerError('Numele statusului este invalid!', 400);
    }
}

module.exports = {
    statuses,
    isValidStatus
};