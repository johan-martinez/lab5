const express = require('express')
const cors = require('cors')
const path = require('path');
const axios = require('axios')
const algorithm = require('./algorithm');

var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))
app.use('./algorithm',algorithm.route);

app.get('/', (req,res) =>{
    res.send(global.myServer);
})


http.listen(port, () => {
    console.log('Client listening on port ', port);
    algorithm.heartBeat();
});