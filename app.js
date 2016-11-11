var express = require('express'),
    app = express(),
    io = require('socket.io'),
    pug = require('pug'),
    path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public/views'));

var grid = require('./grid');

app.get('/', function (req, res) {
    res.render('index');
});

app.listen(3000, function(){
    console.log("Listening to port 3000");
});