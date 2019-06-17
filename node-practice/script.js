// * 1. create an event 'createFile' which will create file '{yourName}.txt' with current date and time inside
// * 2. create an event 'readFile'wich in 10 sec will read '{yourName}.txt' and print out content to console
// * 3. create an event 'updateFile' wich in 10 sec will update '{yourName}.txt' with string 'updated' and print out content to console
// * 4. create an event 'deleteFile' wich in 10 sec will delete '{yourName}.txt' and send email with text 'File {fileName} DELETED!'

const events = require('events');
const createFile = new events.EventEmitter();
const readFile = new events.EventEmitter();
const updateFile = new events.EventEmitter();
const deleteFile = new events.EventEmitter();

const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const readFile2 = promisify(fs.readFile);
const nodemailer = require('nodemailer')

const crud = {}


crud.baseDir = path.join(__dirname, './database');

//Create
crud.create = (file, data) => {
    fs.open(`${crud.baseDir}/${file}.txt`, 'wx', function(error, identifier) {
        let newDate = new Date();
        if(!error && identifier) {   
            
            fs.writeFile(identifier, newDate, (err) => {
                if(!err) {
                    fs.close(identifier, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log("no errors");
                        }
                    })
                } else {
                    console.log('err');
                }
            })
        }
    })
}

//Read
crud.read = (file) => {
    fs.readFile(`${crud.baseDir}/${file}.txt`, 'utf8', (err,data) => {
        if(err) {
            throw err
        } else {
            console.log(data); 
        }
    })
}

//Update
crud.update = (file) => {
    //readFile returns Promise
    readFile2(`${crud.baseDir}/${file}.txt`, "utf8")
    .then(newStream => {
        return newStream + "\n updated"
    })
    .then(finalData => {
        // replace the content in the file with updated data
        fs.truncate(`${crud.baseDir}/${file}.txt`, (error) => {
            if(!error) {
                fs.writeFile(`${crud.baseDir}/${file}.txt`, finalData, (err) => {
                    if(err) {
                        return err
                    }
                })
            } else {
                return error
            }
        })
    })
}

//Delete
crud.delete = (file) => {
    fs.unlink(`${crud.baseDir}/${file}.txt`, (err) => {
        if(!err) {
            console.log('deleted');
        } else {
            return err
        }
    })
}

let myCreateHandler = function() {
    crud.create('david-mora');
    setTimeout(() => {
        readFile.emit('read')
    }, 3000)
}

let myReadHandler = function() {
    crud.read('david-mora');
    setTimeout(() => {
        updateFile.emit('update')
    }, 3000)
}

let myUpdateHandler = function() {
    crud.update('david-mora');
    setTimeout(() => {
        deleteFile.emit('delete')
    }, 3000)
}

let myDeleteHander = function() {
    crud.delete('david-mora');
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'David.mora@codeimmersives.com',
            pass: '123456'
        }
    })
    
    let mailOptions = {
        from: "david.mora@codeimmersives.com",
        to: "david.mora@codeimmersives.com, colin.jaffe@codeimmersives.com",
        subject: "Sending Email using Node.js",
        text: "File david-mora.txt DELETED!"
    }
    
    transporter.sendMail(mailOptions, function(error, info) {
        if(error) {
            console.log(error);
        } else {
            console.log(`Email sent: ${info.response}`);
        }
    })
}


createFile.on('create', myCreateHandler);
readFile.on('read', myReadHandler);
updateFile.on('update', myUpdateHandler);
deleteFile.on('delete', myDeleteHander);


createFile.emit('create');