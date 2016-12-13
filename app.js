var express = require('express'),
    app = express(),
    server = require('http').Server(app),
    io = require('socket.io')(server),
    pug = require('pug'),
    path = require('path');

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'public/views'));
const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

var Grid = require('./dist/grid');
// console.log(item);
app.get('/', function (req, res) {
    res.render('index');
});

var grid = new Grid(2000, 2000, {w: 100, h: 100});
var player = grid.createItem(110, 110);
var item = grid.createItem(115, 115);

console.log(player.getItemsInSurroundingSegments(true));

app.get('/', function (req, res) {
    res.sendfile(__dirname + '/index.html');
});

// io.on('connection', function (socket) {
//     socket.player = grid.createItem(Math.round(Math.random() * 300 + 100), Math.round(Math.random() * 200 + 100));
//
//     socket.player.segment.on('update', function () {
//         emitAllItems(socket);
//     });
//     socket.player.on('update', function () {
//         emitAllItems(socket);
//     });
//     socket.emit('player', socket.player.plain());
//     socket.player.on('move', function (player) {
//         console.log(socket.player.id);
//         console.log(player.id);
//         socket.emit('moveItem', player);
//     });
//     emitAllItems(socket);
//
//     socket.on('moveItem', function (dir) {
//         if(dir === 'left')
//             socket.player.update(socket.player.x - 5, socket.player.y);
//         if(dir === 'right')
//             socket.player.update(socket.player.x + 5, socket.player.y);
//         if(dir === 'up')
//             socket.player.update(socket.player.x, socket.player.y - 5);
//         if(dir === 'down')
//             socket.player.update(socket.player.x, socket.player.y + 5);
//         socket.emit('player', socket.player.plain());
//         socket.player.segment.emitToAllItemsExcept(socket.player, 'move', socket.player.plain());
//     });
// });
function emitAllItems(socket) {
    socket.emit('allItems', socket.player.segment.getItemsExcept(socket.player.id));
}
server.listen(3000, function(){
    console.log("Listening to port 3000");
});