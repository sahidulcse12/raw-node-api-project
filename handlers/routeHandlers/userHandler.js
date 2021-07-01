/*
 * Title: User Handler
 * Description: Handling User routing
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const data = require('../../lib/data');
const { hash } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities')

const handler = {};

handler.userHandler = (requestProperties, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._user[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }

};

handler._user = {};

handler._user.post = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const tosAgreement = typeof (requestProperties.body.tosAgreement) === 'boolean' && requestProperties.body.tosAgreement ? requestProperties.body.tosAgreement : false;

    if (firstName && lastName && phone && password && tosAgreement) {
        //make sure that the user does not exist already
        data.read('user', phone, (err1) => {
            if (err1) {
                const userObject = {
                    firstName,
                    lastName,
                    phone,
                    password: hash(password),
                    tosAgreement,
                };
                // store data
                data.create('user', phone, userObject, (err2) => {
                    if (!err2) {
                        callback(200, {
                            message: 'User was successfully created'
                        })
                    } else {
                        callback(500, {
                            error: 'Could not create user!'
                        })
                    }
                });
            } else {
                callback(500, {
                    error: 'There was a problem in server site'
                })
            }
        });
    } else {
        callback(404, {
            error: 'You have a problem in your request'
        })
    }
};

handler._user.get = (requestProperties, callback) => {
    // check the phone number if valid
    const phone = typeof (requestProperties.queryStringObject.phone) === 'string' && requestProperties.queryStringObject.phone.trim().length === 11 ? requestProperties.queryStringObject.phone : false;

    if (phone) {
        //lookup the user 
        data.read('user', phone, (err, u) => {
            const user = { ...parseJSON(u) }
            if (!err && user) {
                delete user.password;
                callback(200, user);
            }
        })
    } else {
        callback(404, {
            error: 'User was not found'
        })
    }
};

handler._user.put = (requestProperties, callback) => { };

handler._user.delete = (requestProperties, callback) => { };

module.exports = handler;