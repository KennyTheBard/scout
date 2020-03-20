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

        if (!fieldValue) {
            if (!!optional) {
                throw new ServerError(`Lipseste campul ${fieldName}`, 400);
            } else {
                return;
            }
        }
    
        switch (fieldType) {
            case 'ascii':
                if (!validator.isAscii(fieldValue)) {
                    throw new ServerError(`Campul ${fieldName} trebuie sa contina doar caractere ascii`, 400);
                }
                break;
            case 'alpha':
                if (!validator.isAlpha(fieldValue)) {
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

        if (fieldValue.length != fieldLength) {
            throw new ServerError(`Campul ${fieldName} trebuie sa aiba lungimea ${fieldLength}`, 400);
        }

    }
   
}

module.exports ={
    validateFields
}
