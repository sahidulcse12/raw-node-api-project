/*
 * Title: Not Fount Handler
 * Description:Not Found Handling sample routing
 * Author: Sahidul Islam Muhit
 * Date: 28/06/2021
 *
 */

const handler = {}

handler.notFoundHandler = (requestProperties, callback) => {
    callback(404, {
        message: 'Your requested URL was not found!',
    });
}

module.exports = handler;