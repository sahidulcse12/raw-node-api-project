/*
 * Title: User Handler
 * Description: Handling User routing
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const data = require('../../lib/data');
const { createRandomString } = require('../../helpers/utilities')
const { parseJSON } = require('../../helpers/utilities')
const tokenHandler = require('./tokenHandler')
const { maxChecks } = require('../../helpers/environments')

const handler = {};

handler.checkHandler = (requestProperties, callback) => {

    const acceptedMethods = ['get', 'post', 'put', 'delete'];
    if (acceptedMethods.indexOf(requestProperties.method) > -1) {
        handler._check[requestProperties.method](requestProperties, callback);
    } else {
        callback(405);
    }

};

handler._check = {};

handler._check.post = (requestProperties, callback) => {
    // valid input
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (protocol && url && method && successCode && timeoutSeconds) {
        const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

        //lookup the user phone by reading the token
        data.read('tokens', token, (err1, tokenData) => {
            if (!err1 && tokenData) {
                let userPhone = parseJSON(tokenData).phone;

                // lookup the user data
                data.read('user', userPhone, (err2, userData) => {
                    if (!err2 && userData) {
                        tokenHandler._token.verify(token, userPhone, (tokenIsValid) => {
                            if (tokenIsValid) {
                                let userObject = parseJSON(userData);
                                let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                if (userChecks.length < maxChecks) {
                                    let checkId = createRandomString(20);
                                    let checkObject = {
                                        id: checkId,
                                        userPhone,
                                        protocol,
                                        method,
                                        url,
                                        successCode,
                                        timeoutSeconds,
                                    }

                                    // save the object
                                    data.create('checks', checkId, checkObject, (err3) => {
                                        if (!err3) {
                                            //add check id to the user's object
                                            userObject.checks = userChecks;
                                            userObject.checks.push(checkId);

                                            // save the new user data
                                            data.update('user', userPhone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200, userObject)
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
                                    callback(401, {
                                        error: 'User has already reached max checks limit'
                                    })
                                }

                            } else {
                                callback(403, {
                                    error: 'Authentication problem'
                                })
                            }
                        })
                    } else {
                        callback(403, {
                            error: 'User not found'
                        })
                    }
                })
            } else {
                callback(403, {
                    error: 'Authentication problem'
                })
            }
        })
    } else {
        callback(400, {
            error: 'There was a problem in your server side'
        })
    }


};

handler._check.get = (requestProperties, callback) => {

    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        //lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {

                const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        callback(200, parseJSON(checkData));
                    } else {
                        callback(403, {
                            error: 'Authentication failure'
                        })
                    }
                })

            } else {
                callback(500, {
                    error: 'You have a problem in your request'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }

};

handler._check.put = (requestProperties, callback) => {

    const id = typeof (requestProperties.body.id) === 'string' && requestProperties.body.id.trim().length == 20 ? requestProperties.body.id : false;

    // valid input
    let protocol = typeof (requestProperties.body.protocol) === 'string' && ['http', 'https'].indexOf(requestProperties.body.protocol) > -1 ? requestProperties.body.protocol : false;

    let url = typeof (requestProperties.body.url) === 'string' && requestProperties.body.url.trim().length > 0 ? requestProperties.body.url : false;

    let method = typeof (requestProperties.body.method) === 'string' && ['GET', 'POST', 'PUT', 'DELETE'].indexOf(requestProperties.body.method) > -1 ? requestProperties.body.method : false;

    let successCode = typeof (requestProperties.body.successCode) === 'object' && requestProperties.body.successCode instanceof Array ? requestProperties.body.successCode : false;

    let timeoutSeconds = typeof (requestProperties.body.timeoutSeconds) === 'number' && requestProperties.body.timeoutSeconds % 1 === 0 && requestProperties.body.timeoutSeconds >= 1 && requestProperties.body.timeoutSeconds <= 5 ? requestProperties.body.timeoutSeconds : false;

    if (id) {
        if (protocol || url || method || successCode || timeoutSeconds) {
            data.read('checks', id, (err1, checkData) => {
                if (!err1 && checkData) {
                    let checkObject = parseJSON(checkData);

                    const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

                    tokenHandler._token.verify(token, checkObject.userPhone, (tokenIsValid) => {
                        if (tokenIsValid) {
                            if (protocol) {
                                checkObject.protocol = protocol;
                            }

                            if (url) {
                                checkObject.url = url;
                            }

                            if (method) {
                                checkObject.method = method;
                            }

                            if (successCode) {
                                checkObject.successCode = successCode;
                            }

                            if (timeoutSeconds) {
                                checkObject.timeoutSeconds = timeoutSeconds;
                            }

                            // store the checkObject
                            data.update('checks', id, checkObject, (err2) => {
                                if (!err2) {
                                    callback(200)
                                } else {
                                    callback(500, {
                                        error: 'There was a problem in your server side'
                                    })
                                }
                            })

                        } else {
                            callback(403, {
                                error: 'Authentication Error'
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
            callback(400, {
                error: 'You must provide at least one field to update'
            })
        }
    } else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }

};

handler._check.delete = (requestProperties, callback) => {

    const id = typeof (requestProperties.queryStringObject.id) === 'string' && requestProperties.queryStringObject.id.trim().length === 20 ? requestProperties.queryStringObject.id : false;

    if (id) {
        //lookup the check
        data.read('checks', id, (err1, checkData) => {
            if (!err1 && checkData) {

                const token = typeof (requestProperties.headersObject.token) === 'string' ? requestProperties.headersObject.token : false;

                tokenHandler._token.verify(token, parseJSON(checkData).userPhone, (tokenIsValid) => {
                    if (tokenIsValid) {
                        //delete checks data 
                        data.delete('checks', id, (err2) => {
                            if (!err2) {
                                data.read('user', parseJSON(checkData).userPhone, (err3, userData) => {
                                    let userObject = parseJSON(userData);
                                    if (!err3 && userData) {
                                        let userChecks = typeof (userObject.checks) === 'object' && userObject.checks instanceof Array ? userObject.checks : [];

                                        // remove the deleted check id from user's list of checks
                                        let checkPosition = userChecks.indexOf(id);
                                        if (checkPosition > -1) {
                                            userChecks.splice(checkPosition, 1);

                                            // re save the user data
                                            userObject.checks = userChecks;
                                            data.update('user', userObject.phone, userObject, (err4) => {
                                                if (!err4) {
                                                    callback(200);
                                                } else {
                                                    callback(500, {
                                                        error: 'There was a problem in your server side'
                                                    })
                                                }
                                            })
                                        } else {
                                            callback(500, {
                                                error: 'The check id that you are trying to remove is not found user'
                                            })
                                        }

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
                })

            } else {
                callback(500, {
                    error: 'You have a problem in your request'
                })
            }
        })
    } else {
        callback(400, {
            error: 'You have a problem in your request'
        })
    }

};

module.exports = handler;