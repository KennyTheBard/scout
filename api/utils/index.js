const validator = require('validator');

const {
    ServerError
} = require('../errors');
/**
 * 
 * @param {*} field 
 * @throws {ServerError}
 */
const validateFields = (fields) => {
    
    for (let fieldName in fields) {
        const fieldValue = fields[fieldName].value + ''; // validator functioneaza doar pe strings
        const fieldType = fields[fieldName].type;
        const fieldLength = fields[fieldName].length;
        const fieldRequired = fields[fieldName].required;

        if (!fieldValue) {
            if (!!fieldRequired) {
                throw new ServerError(`Lipseste campul ${fieldName}`, 400);
            } else {
                return;
            }
        }
    
        switch (fieldType) {
            case 'username':
                if (!validator.isAlphanumeric(fieldValue.replace('_','').replace('.',''))) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar litere, cifre, punct si underscore`, 400);
                }
                break;
            case 'email':
                if (!validator.isEmail(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie o adresa valida de email`, 400);
                }
                break;
            case 'ascii':
                if (!validator.isAscii(fieldValue.replace(' ',''))) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar caractere ascii si spatii`, 400);
                }
                break;
            case 'alpha':
                if (!validator.isAlpha(fieldValue.replace(' ',''))) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar litere`, 400);
                }
                break;
            case 'int':
                if (!validator.isInt(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie un numar intreg`, 400);
                }
                break;
            case 'jwt':
                if (!validator.isJWT(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa fie jwt`, 400);
                }
                break;
        }

        if (!!fieldLength && fieldValue.length != fieldLength) {
            throw new ServerError(`Campul ${fieldName} trebuie sa aiba lungimea ${fieldLength}`, 400);
        }

    }
   
}

module.exports ={
    validateFields
}
