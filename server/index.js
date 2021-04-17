const express = require('express')
const cors = require('cors')
const path = require('path');
const algorithm = require('./algorithm');

var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);
const db = require('./db/Connection')

db()

app.use(cors())
app.use(express.json())
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

app.get('/status', (req, res) => res.sendStatus(200))

http.listen(port, () => {
    console.log('Client listening on port ', port);
    algorithm.heartBeat();
});