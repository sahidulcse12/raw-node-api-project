/*
 * Title: Utilities 
 * Description: Handle utilities functions
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */
// Dependencies
const crypto = require('crypto');
const environments = require('./environments');

// utilities object - modules scaffolding
const utilities = {};

//parse jsonString to object
utilities.parseJSON = (jsonString) => {
    let output;
    try {
        output = JSON.parse(jsonString)
    } catch {
        output = {};
    }
    return output;
}

// hash function
utilities.hash = (str) => {
    if (typeof (str) === 'string' && str.length > 0) {
        const hash = crypto.createHmac("sha256", environments.secretKey)
            .update(str)
            .digest("hex");
        return hash;
    } else {
        return false;
    }
}

utilities.createRandomString = (strLength) => {
    let length = strLength;
    length = typeof (strLength) === 'number' && strLength > 0 ? strLength : false;

    if (length) {
        let possibleCharacter = 'abcdefghijklmnopqrstuvwxyz1234567890';
        let output = '';
        for (let i = 1; i <= length; i++) {
            let randomCharacter = possibleCharacter.charAt(Math.floor(
                Math.random() * possibleCharacter.length)
            );
            output += randomCharacter;
        }
        return output;
    }
    return false;

}


// final exports
module.exports = utilities;