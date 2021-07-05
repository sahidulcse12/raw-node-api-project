/*
 * Title: Handle notification message
 * Description: Handle notification message
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

// Dependencies
const https = require('https');
const querystring = require('querystring');
const { twilio } = require('./environments')

// notification object- modules scaffolding
const notification = {}

// send sms to user using twilio api
notification.sendTwilioSms = (phone, msg, callback) => {
    //valid input
    const userPhone = typeof (phone) === 'string' && phone.trim().length == 11 ? phone.trim() : false;

    const userMsg = typeof (msg) === 'string' && msg.trim().length > 0 && msg.trim().length <= 1600 ? msg.trim() : false;

    if (userPhone && userMsg) {
        //configure the request payload
        const payload = {
            From: twilio.fromPhone,
            to: `+88${userPhone}`,
            body: userMsg,
        };

        //stringify the payload
        const stringifyPayload = querystring.stringify(payload);

        //configure the request details
        const requestDetails = {
            hostname: 'api.twilio.com',
            method: 'GET',
            path: `/2010-04-01/Accounts/${twilio.accountSid}/Messages.json`,
            auth: `${twilio.accountSid}:${twilio.authToken}`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        };

        //instantiate the request object
        const req = https.request(requestDetails, (res) => {
            //get the status of the sent request
            const status = res.statusCode;
            if (status === 200 || status === 201) {
                callback(false);
            } else {
                callback(`statusCode returned was ${status}`)
            }
        });

        req.on('error', (e) => {
            callback(e);
        })

        req.write(stringifyPayload);
        req.end();


    } else {
        callback('Given parameters were missing or invalid')
    }
}

// module exports
module.exports = notification;
