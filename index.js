/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const http = require('http');
const { handleReqRes } = require('./helpers/handleReqRes');
const environment = require('./helpers/environments');
const data = require('./lib/data')

// App object - module scaffolding
const app = {}

// testing file system
// data.create('test', 'newFile', { name: 'Bangladesh', language: 'Bengali' }, (err) => {
//     console.log(`error was `, err);
// })

// data.read('test', 'newFile', (err, data) => {
//     console.log(err, data);
// })

// data.update('test', 'newFile', { name: 'England', language: 'English' }, (err) => {
//     console.log(err);
// })

// data.delete('test', 'newFile', (err) => {
//     console.log(err);
// })


// Create Server
app.createServer = () => {
    const server = http.createServer(app.handleReqRes);
    server.listen(environment.port, () => {
        console.log(`listening the port of ${environment.port}`);
    });
};

// Handle requests and responses
app.handleReqRes = handleReqRes;

app.createServer();