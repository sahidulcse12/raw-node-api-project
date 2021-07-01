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


// final exports
module.exports = utilities;