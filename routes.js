/*
 * Title: Route
 * Description:Route
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const { sampleHandler } = require('./handlers/routeHandlers/sampleHandler');
const { userHandler } = require('./handlers/routeHandlers/userHandler');
const { tokenHandler } = require('./handlers/routeHandlers/tokenHandler');

const routes = {
    sample: sampleHandler,
    user: userHandler,
    token: tokenHandler,
};
//console.log(routes)

module.exports = routes;