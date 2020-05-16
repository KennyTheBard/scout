const Enum = require('enum')

const pending_statuses = new Enum(['PENDING', 'ACCEPTED', 'DECLINED'],
    { freeze: true });

const isValidpendingStatus = (statusName) => {
    if (!pending_statuses.isDefined(statusName)) {
        throw new ServerError('Numele statusului este invalid!', 400);
    }
}

module.exports = {
    pending_statuses,
    isValidpendingStatus
};