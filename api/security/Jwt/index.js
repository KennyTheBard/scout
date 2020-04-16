const jwt = require('jsonwebtoken');

const {
    ServerError
} = require('../../errors');

const {
    validateFields
} = require('../../utils');

const options = {
    issuer: process.env.JWT_ISSUER,
    subject: process.env.JWT_SUBJECT,
    audience: process.env.JWT_AUDIENCE
};

const generateToken = async (payload) => {
    try {
        const signed = jwt.sign(payload, process.env.JWT_SECRET_KEY, options);
        return signed;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la semnarea tokenului!", 500);
    }
};

const verifyAndDecodeData = async (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY, options);
        return decoded;
    } catch (err) {
        console.trace(err);
        throw new ServerError("Eroare la decriptarea tokenului!", 400);
    }
};

const authorizeAndExtractToken = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw new ServerError('Lipseste headerul de autorizare!', 403);
        }
        const token = req.headers.authorization.split(" ")[1]; // se separa dupa " " deoarece este de forma: Bearer 1wqeiquqwe0871238712qwe

        validateFields({
            jwt: {
                value: token,
                type: 'jwt'
            }
        });

        const decoded = await verifyAndDecodeData(token);
        req.state = {
            decoded
        };

        next();
    } catch (err) {
        next(err);
    }
};

module.exports = {
    generateToken,
    authorizeAndExtractToken,
};