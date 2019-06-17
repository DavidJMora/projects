const http = require('http');
const url = require('url');
const fs = require('fs');
const path = require('path');

const port = process.argv[2] || 8000

const mimeType = {
    '.ico' : 'image/x-icon',
    '.html' : 'text/html',
    '.js' : 'text/javascript',
    '.json' : 'application/json',
    '.css' : 'text/css',
    '.png' : 'image/png',
    '.jpg' : 'image/jpg',
    '.wav' : 'audio/wav',
    '.mp3' : 'audio/mpeg',
    '.svg' : 'image/svg+xml',
    '.pdf' : 'application/pdf',
    '.doc' : 'application/msword',
    '.eot' : 'application/vnd.ms-fontobject',
    '.ttf' : 'application/form-sfnt'
}

http.createServer(function(request, response) {
    console.log(`${request.method} ${request.url}`);
    
    const parsedURL = url.parse(request.url);

    // Avoid directory traversal attack
    const sanitizePath = path.normalize(parsedURL.pathname).replace(/^(\.\.[\/\\])+/, '');
    let pathname = path.join(__dirname, sanitizePath);

    fs.exists(pathname, function(exist) {
        if(!exist) {
            response.statusCode = 404;
            response.end(`File ${pathname} not found!`)

            return
        }

        if(fs.statSync(pathname).isDirectory()) pathname += '/index.html'

        fs.readFile(pathname, function(err, data) {
            if(err) {
                response.statusCode = 500;
                response.end("Error getting the file")
                console.log(`Error getting the file: ${err}`);
            } else {
                const ext = path.parse(pathname).ext;

                response.setHeader('Content-type', mimeType[ext] || 'text/plain');
                response.end(data)
            }
        })
    })
}).listen(parseInt(port))

console.log(`Server listening to port ${port}`);
