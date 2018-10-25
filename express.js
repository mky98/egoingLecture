const express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
const fs = require('fs');
var server = express();

server.use(bodyParser.urlencoded({ extended: false }));
server.use( cookieParser() );

var authData = {username : 'yubs', userpassword : '1111', nickname : 'yeops'};

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

function templateHTML(_listTag, _title, _desc, _nickname){
    var authUI = '';
    if (_nickname){
        authUI = '<a href="/logout">logout</a>';
    }else{
        authUI = '<a href="/logIn">logIn</a>';
    }

    var content = `
            <!doctype html>
            <html>
                <head>
                    <meta charset="utf-8">
                    <title>WEB</title>
                </head>
                <body>
                    ${authUI}
                    <h1><a href="/">WEB</a></h1>
                    <ul>
                        ${_listTag}
                    </ul>
                    <a href='/create'>create</a>
                    <h2>${_title}</h2>
                    ${_desc}
                </body>
            </html>
        `;
    return content;
}

server.get('/', function (request, response) {

    var username = request.cookies.username;
    var userpassword = request.cookies.userpassword;
    var nickname = null;
    if (username === authData.username && userpassword === authData.userpassword){
        nickname = authData.nickname;
    }

    var title = 'Welcome';
    var desc = 'Hello, web';
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);

    response.write(content);
    response.end();
});

server.post('/create_process',function (request, response) {
    const title = request.body.title;
    const desc = request.body.desc;
    fs.writeFileSync(`data/${title}`, desc);
    response.redirect(`/topic/${title}`);
});

server.post('/login_process',function (request, response) {
    const username = request.body.username;
    const userpassword = request.body.userpassword;

    if ( username === authData.username ){
        console.log('아이디 맞음');
        if ( userpassword === authData.userpassword ){
            console.log('비번 맞음');
            response.append('Set-Cookie', `username=${username}`);
            response.append('Set-Cookie', `userpassword=${userpassword}`);
            return response.redirect('/');
        }
    }

    return response.send('누구?');
});

server.get('/cookie/set', function (request, response) {
    response.cookie('foo','abc');
    response.send('set cookies');
});

server.get('/cookie/get', function (request, response) {
    console.log(request.cookies);
    response.send('get cookies');
});

server.get('/create', function (request, response) {

    var username = request.cookies.username;
    var userpassword = request.cookies.userpassword;
    var nickname = null;
    if (username === authData.username && userpassword === authData.userpassword){
        nickname = authData.nickname;
    }else{
        return response.redirect('/');
    }

    var title = 'Create';
    var desc = `
    <form action="/create_process" method="post">
        <p><input type="text" name="title" placeholder="title"></p>
        <p><textarea name="desc" placeholder="description"></textarea></p>
        <p><input type="submit"></p>
    </form>`;
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);

    response.write(content);
    response.end();
});

server.get('/login', function (request, response) {
    var title = 'login';
    var desc = `
    <form action="/login_process" method="post">
        <p><input type="text" name="username" placeholder="username"></p>
        <p><input type="password" name="userpassword" placeholder="password"></textarea></p>
        <p><input type="submit" value="login"></p>
    </form>`;
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc);

    response.write(content);
    response.end();
});


server.get('/topic/:title', function (request, response) {

    var username = request.cookies.username;
    var userpassword = request.cookies.userpassword;
    var nickname = null;
    if (username === authData.username && userpassword === authData.userpassword){
        nickname = authData.nickname;
    }

    var title = request.params.title;
    var desc = fs.readFileSync('data/'+ title, 'utf8');
    var listTag = templateList();
    var content = templateHTML(listTag, title, desc, nickname);

    response.write(content);
    response.end();
});

server.get('/logout', function(request, response){
    response.append('Set-Cookie', 'username=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.append('Set-Cookie', 'userpassword=deleted; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'); 
    response.redirect('/');
});

server.listen(3000);