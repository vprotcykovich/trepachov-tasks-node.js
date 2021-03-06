const http = require('http');
const reader = require('fs');

http.createServer((request, response) => {
    if (request.method === 'GET') {
        // Sends the css static file
        if (request.url.indexOf('.css') !== -1) {
            reader.readFile(__dirname + '/css/styles.css', function (err, data) {
                if (err) console.log(err);
                response.writeHead(200, {'Content-Type': 'text/css'});
                response.end(data);
            });
            return
        }
        // Sends the static js file
        if (request.url.indexOf('.js') !== -1) {
            reader.readFile(__dirname + '/js/main.js', function (err, data) {
                if (err) console.log(err);
                response.writeHead(200, {'Content-Type': 'text/javascript'});
                response.end(data);
            });
            return
        }
        response.writeHead(200, {"Content-Type": "text/html; charset=utf-8"});
        if (request.url === '/page1/') {
            reader.readFile('./content/index1.html', (err, data) => {
                if (err) throw err;
                sendRespWithContent(cleanSymbols(data), getTitle(data), response);
            });
            return
        }
        if (request.url === '/page2/') {
            reader.readFile('./content/index2.html', (err, data) => {
                if (err) throw err;
                sendRespWithContent(cleanSymbols(data), getTitle(data), response);
            });
            return
        }
        if (request.url === '/page3/') {
            reader.readFile('./content/index3.html', (err, data) => {
                if (err) throw err;
                sendRespWithContent(cleanSymbols(data), getTitle(data), response);
            });
        }
    }
}).listen(8080);

function sendRespWithContent(content, title, response) {
    reader.readFile('./layout/layout.html', 'utf8', (err, data) => {
        if (err) throw err;
        let updatedMarkup = data.toString('utf8')
            .replace(/\{\%content\%\}/, content)
            .replace(/\{\%title\%\}/, title);
        response.end(updatedMarkup);
    });
}

function getTitle(text) {
    return text.toString('utf8').match(/\{\{(.+?)\}\}/)[1];
}

function cleanSymbols(text) {
    return text.toString('utf8').replace(/\{\{(.+?)\}\}/, '');
}


