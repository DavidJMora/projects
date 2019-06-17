const formidable = require('formidable');
const http = require('http');
const fs = require('fs');
const path = require('path');

// 1
// http.createServer(function(req, res) {
//     res.writeHead(200, {'Content-Type': 'text/html'});
//     res.write('<form action="fileUpload" method="POST" enctype="multipart/form-data">');
//     res.write('<input type="file" name="fileToUpload"><br>');
//     res.write('<input type="submit">');
//     res.write('</form>')
// }).listen(8080)

// 2
// http.createServer(function(req, res) {
//     if(req.url === "/fileUpload") {
//         let form = new formidable.IncomingForm();

//         form.parse(req, function(err, fields, files) {
//             if(!err) {
//                 res.write("File Uploaded");
//                 res.end()
//             }
//         })

//     } else {
//         res.writeHead(200, {'Content-Type': "text/html"})
//         res.write(`
//         <form action="fileUpload" method="POST" enctype="multipart/form-data">
//             <input type="file" name="fileToUpload"><br>
//             <input type="submit">
//         </form>
//         `)

//         res.end();
//     }
// }).listen(8080)

// 3
http.createServer(function(req, res) {
        if(req.url === "/fileUpload") {
            let form = new formidable.IncomingForm();
    
            form.parse(req, function(err, fields, files) {
                if(!err) {
                    let oldPath = files.fileToUpload.path;
                    console.log(oldPath);

                    let newPath = `${__dirname}/uploaded/${files.fileToUpload.name}`;
                    console.log(newPath);

                    fs.rename(oldPath, newPath, function(err) {
                        if(err) throw err


                            res.write("File uploaded and moved!");

                            res.end();
                        
                    })
                }
            })
    
        } else {
            res.writeHead(200, {'Content-Type': "text/html"})
            res.write(`
            <form action="fileUpload" method="POST" enctype="multipart/form-data">
                <input type="file" name="fileToUpload"><br>
                <input type="submit">
            </form>
            `)
    
            res.end();
        }
    }).listen(8080)