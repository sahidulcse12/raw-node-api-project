


const fs = require('fs');
const path = require('path');

const lib = {};

lib.basedir = path.join(__dirname, '/../.data/');

// write data to file
lib.create = (dir, file, data, callback) => {
    // open file for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'wx', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert data to string
            const stringData = JSON.stringify(data);

            //write data to file and close it
            fs.writeFile(fileDescriptor, stringData, (err2) => {
                if (!err2) {
                    fs.close(fileDescriptor, (err3) => {
                        if (!err3) {
                            callback(false)
                        } else {
                            callback('Error closing the new file')
                        }
                    })
                } else {
                    callback('Error writing to new file!')
                }
            })
        } else {
            callback('Could not create new file. it may already exist')
        }
    })
}

// read data from file
lib.read = (dir, file, callback) => {
    fs.readFile(`${lib.basedir + dir}/${file}.json`, 'utf8', (err, data) => {
        callback(err, data);
    })
}

// update existing file
lib.update = (dir, file, data, callback) => {
    // file open for writing
    fs.open(`${lib.basedir + dir}/${file}.json`, 'r+', (err, fileDescriptor) => {
        if (!err && fileDescriptor) {
            // convert the data to string
            const stringData = JSON.stringify(data);

            // truncate(file khali kora..khali na korle likhbo kmne?) the file
            fs.ftruncate(fileDescriptor, (err1) => {
                if (!err1) {
                    //writing to the file and close it
                    fs.writeFile(fileDescriptor, stringData, (err2) => {
                        if (!err2) {
                            //close the file
                            fs.close(fileDescriptor, (err3) => {
                                if (!err3) {
                                    callback(false)
                                } else {
                                    callback(`Error closing file`)
                                }
                            })
                        } else {
                            callback(`Error writing to the file`)
                        }
                    })
                } else {
                    callback(`Error truncating file`)
                }
            })
        } else {
            callback(`Error updating. file may not exist`)
        }
    })
}

// delete the file
lib.delete = (dir, file, callback) => {
    //unlink file
    fs.unlink(`${lib.basedir + dir}/${file}.json`, (err) => {
        if (!err) {
            callback(false)
        } else {
            callback(`Error deleting file`)
        }
    })
}

module.exports = lib;