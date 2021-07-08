/*
 * Title: Uptime Monitoring Application
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const server = require('./lib/server')
const workers = require('./lib/worker')

// App object - module scaffolding
const app = {}

//@TODO sms request check 
// sendTwilioSms('01777877630', 'hello muhit', (err) => {
//     console.log(err)
// })

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
app.init = () => {
    // start the server
    server.init();

    // start the workers
    workers.init();
};

app.init();

module.exports = app;