const BOARD_STATUSES = ['SELECTED FOR DEVELOPMENT',
'IN PROGRESS',
'READY FOR CODE REVIEW',
'READY FOR TESTING',
'DONE'];

const STATUSES = ['TODO', ...BOARD_STATUSES];

module.exports = {
    BOARD_STATUSES, STATUSES
}