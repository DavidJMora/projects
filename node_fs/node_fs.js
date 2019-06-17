const fs = require('fs');
const path = require('path');
const {promisify} = require('util');
const readFile = promisify(fs.readFile);

const crud = {};

crud.baseDir = path.join(__dirname,'./database');

/**
 * CREATE
 */
crud.create = (file,data) => {
    fs.open(`${crud.baseDir}/${file}.json`, 'wx', function(error, identifier) {
        if(!error && identifier) {
            let jsonArray = [];
            jsonArray.push(data);

            let stringData = JSON.stringify(jsonArray, null, 3);

            fs.writeFile(identifier, stringData, (err) => {
                if(!err) {
                    fs.close(identifier, (err) => {
                        if(err) {
                            console.log(err);
                        } else {
                            console.log('no errors');
                        }
                    })
                } else {
                    console.log('err');
                    
                }
            })
        }
    })
}

crud.create('cars', {"name": "Ford", "price": "$3000"})

/**
 * r = open file for reading. An exception occurs if the file does not exist.
 * r+ = open file for reading and writing. An exception occurs if the file does not exist.
 * rs = open file for reading in synchronous mode.
 * rs+ = open file for reading and writing, telling the OS to open it synchronously.
 * w = open for writing. The file is created(if it does not exist) or truncated(if it exists).
 * wx = same as 'w' but fails if path exists.
 * w+ = open file for reading and writing. The file is created(if it does not exist) or truncated(if it exists).
 * wx+ = same as 'w+' but fails if path exists.
 * a = open file for appending. The file is created if it doesnt exist.
 * ax = same as 'a' but fails if path exists.
 * a+ = opens file for reading and appending. The file is created if it doesnt exist.
 * ax+ = same as 'a+' but fails if path exists.
 */

/**
 * READ
 */
crud.read = (file) => {
    fs.readFile(`${crud.baseDir}/${file}.json`, 'utf8', (err,data) => {
        if(err) {
            throw err
        } else {
            console.log(data); 
        }
    })
}


/**
 * UPDATE
 */
// crud.update = (file, data) => {
//     let stringData = `,${JSON.stringify(data)}`
    
//     fs.appendFile(`${crud.baseDir}/${file}.json`, stringData, (err) => {
//         if(err) {
//             throw err
//         } else {
//             console.log("Updated");
//         }
//     })
// }

/**
 * New Update Function
 */

crud.update = (file, data) => {
    //readFile returns Promise
    readFile(`${crud.baseDir}/${file}.json`, "utf8")
        .then(newStream => {
            //change string to JS object
            let newData = JSON.parse(newStream)

            //push our update to array
            newData.push(data)

            //return data as a string
            return JSON.stringify(newData, null, 3)
        })
        .then(finalData => {
            // replace the content in the file with updated data
            fs.truncate(`${crud.baseDir}/${file}.json`, (error) => {
                if(!error) {
                    fs.writeFile(`${crud.baseDir}/${file}.json`, finalData, (err) => {
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
// crud.create('cars-updated', {'name': 'mercedes', 'price': '$400'})
// crud.update('cars-updated', {'name': 'toyota', 'price': '$550'})
crud.read('cars-updated')
// crud.update('cars', {'name': 'Tesla', 'price': "$20000"})

/**
 * 1. read current content of file
 * 2. append updates
 * 3. truncate the file and replace
 */


/**
  * DELETE
  */
crud.delete = (file) => {
    fs.unlink(`${crud.baseDir}/${file}.json`, (err) => {
        if(!err) {
            console.log('deleted');
        } else {
            return err
        }
    })
}

crud.delete('cars')