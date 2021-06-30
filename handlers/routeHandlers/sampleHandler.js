/*
 * Title: Sample Handler
 * Description: Handling sample routing
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

const handler = {}

handler.sampleHandler = (requestProperties, callback) => {
    console.log(requestProperties);

    callback(200, {
        message: 'This is a sample url',
    });
}

module.exports = handler;