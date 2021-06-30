/*
 * Title: Handle Request and Response
 * Description: A RESTFul API to monitor up or down time of user defined links
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const url = require('url');
const { StringDecoder } = require('string_decoder');
const routes = require('../routes');
const { notFoundHandler } = require('../handlers/routeHandlers/notFoundHandler');


// handle object - module scaffolding
const handler = {}

handler.handleReqRes = (req, res) => {
    // handle requests
    // get the url and parse it....user request er perspective a kaj korte hobe..tai ja lagbe ta ber kore nicchi
    const parsedUrl = url.parse(req.url, true); // url ta age parse korte hobe amke
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');
    const method = req.method.toLowerCase();
    const queryStringObject = parsedUrl.query;
    const headersObject = req.headers;

    const requestProperties = {
        parsedUrl,
        path,
        trimmedPath,
        method,
        queryStringObject,
        headersObject,
    };


    const decoder = new StringDecoder('utf-8');
    let realData = '';

    const chosenHandler = routes[trimmedPath] ? routes[trimmedPath] : notFoundHandler;

    req.on('data', (buffer) => {
        realData += decoder.write(buffer);
    })

    req.on('end', () => {
        realData += decoder.end();
        chosenHandler(requestProperties, (statusCode, playLoad) => {
            statusCode = typeof (statusCode) === 'number' ? statusCode : 500;
            playLoad = typeof (playLoad) === 'object' ? playLoad : {};

            const playLoadString = JSON.stringify(playLoad);

            // responses handler
            res.writeHead(statusCode)
            res.end(playLoadString);
        })

        // handle responses
        res.end('hello world');
    })
}

module.exports = handler;