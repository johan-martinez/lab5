const express = require('express')
const cors = require('cors')
const path = require('path');
const fs = require('fs');
const logger = require('./logger');

var app = express()
app.use(cors())
app.use(express.json())

var port = process.env.PORT || 5000
var http = require('http').createServer(app);
const io = require('socket.io')(http);

const monitor = require('./monitor');

app.post('/info',(req,res)=>{
    logger.info(req.body.message)
    res.sendStatus(200)
})

app.use(express.static(path.join(__dirname, 'public')))

io.sockets.on('connection', (socket) => {
    socket.on('send-log',(data)=>{
        logger.info(String(data))
    })
    
    setInterval( ()=>{
        let servers=fs.readFileSync('monitoring.json')
        socket.emit('servers',JSON.parse(servers))
        let logs = fs.readFileSync(path.join(__dirname, '/logs/information.log'))
        socket.emit('logs',logs.toString())
    },1000)
})


http.listen(port, () => {
    console.log('Monitor listening on port ', port);
})