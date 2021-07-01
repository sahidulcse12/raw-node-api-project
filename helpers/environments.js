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
    secretKey: 'dshshgwsohwoe'
};

environments.production = {
    port: 5000,
    envName: 'production',
    secretKey: 'hgdskjslkhsd'
};

// determine which environments was passed
const currentEnvironment = typeof process.env.NODE_ENV === 'string' ? process.env.NODE_ENV : 'staging';

// export corresponding environments object
const environmentToExports = typeof (environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// final exports
module.exports = environmentToExports;