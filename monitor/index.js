const express = require('express')
const cors = require('cors')
const path = require('path');
const shell = require('shelljs');
const query = require('./query')
const sockets = require('./sockets')
const fs = require('fs')

var app = express()

var port = process.env.PORT || 5000
var http = require('http').createServer(app);
const io = require('socket.io')(http);

app.use(express.json())
app.use(cors())
app.use(express.static(path.join(__dirname, 'public')))

app.post('/newServer', async (req, res) => {
    try{
        let newPort = await query.getIdMajor()
        newPort = newPort ? newPort.id + 1 : 3000;
        shell.exec(`sh new_server.sh ${newPort}`)
        await query.saveData({server: `http://127.0.0.1:${newPort}`, id: newPort});
        sockets.addServer(`http://127.0.0.1:${newPort}`)
        res.sendStatus(200)
    } catch{ res.sendStatus(500) }  
})

io.sockets.on('connection', (socket) => { 
    setInterval( ()=>{
        socket.emit('servers', Object.values(global.monitoring || []))
        let logs = fs.readFileSync(path.join(__dirname, '/logs/information.log'))
        socket.emit('logs',logs.toString())
    }, 1000)
})

http.listen(port, async () => {
    console.log('Monitor listening on port ', port);
    let urls = await query.getUrls()
    sockets.init(urls)
})