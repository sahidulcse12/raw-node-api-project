/*
 * Title: environments
 * Description: Handle environments
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// environments object - modules scaffolding
const environments = {};

environments.staging = {
    port: 3000,
    envName: 'staging',
    secretKey: 'dshshgwsohwoe',
    maxChecks: 5,
    twilio: {
        fromPhone: '+12512704109',
        accountSid: 'ACf0786408e1196bf83de8a1b93ac8baa6',
        authToken: '9723d97a5f279c789f11c84ba1d16dc0',
    },
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'hgdskjslkhsd',
    maxChecks: 5,
    twilio: {
        fromPhone: '+12512704109',
        accountSid: 'ACf0786408e1196bf83de8a1b93ac8baa6',
        authToken: '9723d97a5f279c789f11c84ba1d16dc0',
    },
};

// determine which environments was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environments object
const environmentToExports = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// final exports
module.exports = environmentToExports;