const express = require('express');
const fs = require('fs');
var server = express();

function templateList(){
    var topics = fs.readdirSync('data');
    var i = 0;
    var listTag = '';
    while(i < topics.length){
        listTag = listTag + `<li><a href="/topic/${topics[i]}">${topics[i]}</a></li>`;
        i = i + 1;
    }
    return listTag;
}

function templateHTML(_listTag, _title, _desc){
    var content = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>WEB</title>
                </head>
                <body>
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        ${_listTag}
                    </ul>
                    <h2>${_title}</h2>
                    ${_desc}
                </body>
            </html>
        `;
    return content;
}


server.get('/', function (request, response) {
    var title = 'Welcome';
    var desc = 'Hello, web';
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);

    response.write(content);
    response.end();
});


server.get('/topic/:title', function (request, response) {
    var title = request.params.title;
    var desc = fs.readFileSync('data/'+ title, 'utf8');
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);

    response.write(content);
    response.end();
});
server.listen(3000);