const {
    ServerError
} = require('../errors');

const extractPathParam = (param) => {
    return async (req, res, next) => {
        try {
            const {
                [param] : aux
            } = req.params;
    
            req.state = {
                [param] : aux,
                ...req.state
            };
            next();
        } catch (err) {
            next(err);
        }
    }
}

module.exports = {
    extractPathParam
}