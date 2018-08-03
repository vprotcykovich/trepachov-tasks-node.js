const http = require('http');
const reader = require('fs');
const path = require('path');
const port = process.env.PORT || 8080;

/* All allowed files extensions for this site and its content type */
const extensions = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css",
    ".js": "application/javascript",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".eot": "application/vnd.ms-fontobject",
    ".woff": "font/woff",
    ".woff2": "font/woff2",
    ".ttf": "font/ttf",
    ".svg": "image/svg+xml",
    ".ico": "image/x-icon"
};

/* Creates the server and listens to the port in order to handle client requests */
http.createServer((request, response) => {
    if (request.method === 'GET') {
        let mimeType = extensions[path.extname(request.url)];
        let filePath = request.url;
        if (request.url === "/") {
            mimeType = extensions[".html"];
            filePath = "/index.html";
        }
        getFiles(filePath, response, mimeType);
    }
}).listen(port, () => {
    console.log(`listening on *:${port}`);
});

/* Helps to get the title of each page */
function getTitle(text) {
    return text.toString('utf8').match(/\{\{(.+?)\}\}/)[1];
}

/* Helps to get the content of each page */
function cleanSymbols(text) {
    return text.toString('utf8').replace(/\{\{(.+?)\}\}/, '');
}

/* Helps to get and deliver the markup of each page to the client */
function getMarkup(markupFile, contentPath, response, mimeType) {
    reader.readFile(__dirname + contentPath, (err, data) => {
        if (err) throw err;
        let updatedMarkup = markupFile.toString('utf8')
            .replace(/\{\%content\%\}/, cleanSymbols(data))
            .replace(/\{\%title\%\}/, getTitle(data));
        response.writeHead(200, {
            "Content-type": mimeType,
            "Content-Length": updatedMarkup.length
        });
        response.end(updatedMarkup);
    });
}

/* Helper function handles file verification and delivery to the client */
function getFiles(filePath, res, mimeType) {
    let flag = false;
    let contentPath;
    //checks if it is a markup file
    if (mimeType === `${extensions[".html"]}`) {
        //Sets correct paths
        contentPath = `/content${filePath}`;
        filePath = "/layout/index.html";
        flag = true;
    }
//does the requested file exist?
    reader.exists(__dirname + filePath, (exists) => {
        //if it does...
        if (exists) {
            //read the file, run the anonymous function
            reader.readFile(__dirname + filePath, (err, contents) => {
                if (!err) {
                    //if there was no error
                    //send the contents with the default 200/ok header
                    if (flag) {
                        getMarkup(contents, contentPath, res, mimeType);
                        return;
                    }
                    res.writeHead(200, {
                        "Content-type": mimeType,
                        "Content-Length": contents.length
                    });
                    res.end(contents);
                    return;
                }
                //for our own troubleshooting
                console.dir(err);
            });
        }
    });
}