const express = require('express')
const cors = require('cors')
const path = require('path');
const algorithm = require('./algorithm');
const shell = require('shelljs');
const fs = require('fs')
var app = express()
var port = process.env.PORT || 3000
var http = require('http').createServer(app);
const io = require('socket.io')(http);
const db = require('./db/Connection')
const morgan = require('morgan')

global.socket = io.sockets

db()

app.use(express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json())
app.use(morgan('[INFO] :date[iso] [Request]: :method :url [Response]: :status :response-time ms', {
        stream: fs.createWriteStream('./logs/access.log', {flags: 'a'}), 
        skip:  (req, res) => (
            req.url.endsWith('/') || req.url.endsWith('/bundle.js') || req.url.endsWith('/status') || req.url.endsWith('/favicon.ico') )&& req.method == 'GET' 
    }))

io.sockets.on('connection', (socket) => {
    setInterval(() => {
        socket.emit('data-server', global.myServer || {})
        socket.emit('logs', fs.readFileSync('./logs/access.log').toString())
    }, 1000)
})

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
    } catch (error) { res.sendStatus(500); }
})

app.get('/status', (req, res) => {
    res.sendStatus(200)
})

http.listen(port, async () => {
    console.log('Client listening on port ', port);
    algorithm.heartBeat();
});