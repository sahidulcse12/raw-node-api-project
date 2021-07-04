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
const tokenHandler = require('./tokenHandler')

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
        // verify tokens
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //lookup the user 
                data.read('user', phone, (err, u) => {
                    const user = { ...parseJSON(u) }
                    if (!err && user) {
                        delete user.password;
                        callback(200, user);
                    } else {
                        callback(404, {
                            error: 'Requested user was not found'
                        })
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication failure'
                })
            }
        });

    } else {
        callback(404, {
            error: 'User was not found'
        })
    }
};

handler._user.put = (requestProperties, callback) => {
    const firstName = typeof (requestProperties.body.firstName) === 'string' && requestProperties.body.firstName.trim().length > 0 ? requestProperties.body.firstName : false;

    const lastName = typeof (requestProperties.body.lastName) === 'string' && requestProperties.body.lastName.trim().length > 0 ? requestProperties.body.lastName : false;

    const password = typeof (requestProperties.body.password) === 'string' && requestProperties.body.password.trim().length > 0 ? requestProperties.body.password : false;

    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;

    if (phone) {
        if (firstName || lastName || password) {
            // verify tokens
            const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

            tokenHandler._token.verify(token, phone, (tokenId) => {
                if (tokenId) {
                    //lookup the user 
                    data.read('user', phone, (err1, uData) => {

                        const userData = { ...parseJSON(uData) };

                        if (!err1 && userData) {

                            if (firstName) {
                                userData.firstName = firstName;
                            }
                            if (lastName) {
                                userData.lastName = lastName; firstName;
                            }
                            if (firstName) {
                                userData.password = hash(password);
                            }

                            // store to database
                            data.update('user', phone, userData, (err2) => {
                                if (!err2) {
                                    callback(200, {
                                        "message": 'User was update successfully'
                                    })
                                } else {
                                    callback(500, {
                                        error: "There was a problem in your server side"
                                    })
                                }
                            })

                        } else {
                            callback(400, {
                                error: 'You have a problem in your request'
                            })
                        }
                    })

                } else {
                    callback(403, {
                        error: 'Authentication failure'
                    })
                }
            });
        } else {
            callback(400, {
                error: 'You have a problem in your request'
            })
        }
    } else {
        callback(400, {
            error: 'Invalid phone number. please try again'
        })
    }
};

handler._user.delete = (requestProperties, callback) => {
    const phone = typeof (requestProperties.body.phone) === 'string' && requestProperties.body.phone.trim().length === 11 ? requestProperties.body.phone : false;
    if (phone) {


        // verify tokens
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        tokenHandler._token.verify(token, phone, (tokenId) => {
            if (tokenId) {
                //lookup the user 
                data.read('user', phone, (err1, userData) => {
                    if (!err1 && userData) {
                        //delete the user
                        data.delete('user', phone, (err2) => {
                            if (!err2) {
                                callback(200, {
                                    "message": 'User deleted successfully'
                                })
                            } else {
                                callback(500, {
                                    error: 'There was a problem in your server side'
                                })
                            }
                        })
                    } else {
                        callback(500, {
                            error: 'There was a problem in your server side'
                        })
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication failure'
                })
            }
        });

    } else {
        callback(400, {
            error: 'There was a problem'
        })
    }

};

module.exports = handler;