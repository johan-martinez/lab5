const express = require('express')
const cors = require('cors')
const path = require('path');
const algorithm = require('./algorithm');
const shell = require('shelljs');

var app = express()
app.use(cors())
app.use(express.json())
var port = process.env.PORT || 3000
var monitorIP= process.env.monitorIP || 'http://localhost:5000'
var http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./db/Connection')
const ioc =require('socket.io-client')

global.socket=ioc.io(monitorIP).connect()

global.socket.on('logs',(data)=>{
    io.sockets.emit('logs',data)
})

global.socket.on('servers',(data)=>{
    io.sockets.emit('servers',data)
})

io.sockets.on('connection', (socket) => {
    setInterval( ()=>{
        socket.emit('data-server',global.myServer||{})
    },1000)
})

db()

app.use(express.static(path.join(__dirname, 'public')))

app.put('/candidate', (req, res) => {
    algorithm.startAlgorithm()
    res.sendStatus(200)
})

app.put('/stopBeat', (req, res) => {
    global.doBeat = false;
    res.sendStatus(200);
})

app.put('/newLeader', (req, res) => {
    global.doBeat = true;
    algorithm.heartBeat();
    res.sendStatus(200);
})

app.post('/stopInstance', (req, res) => {
    try {
        shell.exec(`docker stop Server${global.myServer.id}`)
        res.sendStatus(200);
    } catch (error) {
        res.sendStatus(500);
    }
    
})

app.get('/status', (req, res) => {
    res.sendStatus(200)
})

http.listen(port, async () => {
    console.log('Client listening on port ', port);
    algorithm.heartBeat();
});