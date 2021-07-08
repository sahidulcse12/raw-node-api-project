/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('../helpers/handleReqRes');
// const environment = require('./helpers/environments');
// const data = require('./lib/data')
// const { sendTwilioSms } = require('./helpers/notification')

// App object - module scaffolding
const server = {}

// configure
server.config = {
    port: 3000,
}

// Create Server
server.createServer = () => {
    const createServerVariable = http.createServer(server.handleReqRes);
    createServerVariable.listen(server.config.port, () => {
        console.log(`listening the port of ${server.config.port}`);
    });
};

// Handle requests and responses
server.handleReqRes = handleReqRes;

// start the server
server.init = () => {
    server.createServer();
}

// exports server
module.exports = server;