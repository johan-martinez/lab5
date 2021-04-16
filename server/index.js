const express = require('express')
const cors = require('cors')
const path = require('path');
const axios = require('axios')

var app = express()
var port = process.env.PORT | 3000
var http = require('http').Server(app);
const io = require('socket.io')(http);

var sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'public')))

let servers = [{ server: "http://localhost:3000", isLeader: false, id: 3000 },
{ server: "http://localhost:3001", isLeader: false, id: 3001 },
{ server: "http://localhost:3002", isLeader: false, id: 3002 }]

let doBeat = true;
let imLeader = false;
let id = port;

async function heartBeat() {
    while (doBeat && !imLeader) {
        let leader = getLeader()
        console.log(leader);
        try {
            await axios.get(leader)
        } catch {
            notifyElection();
            doBeat = false;
        }
        await sleep(Math.random() * (10 - 2) + 2)
    }
}

// db
function getLeader() {
    return servers.find(x => x.isLeader).server
}

function notifyElection() {
    let urls = getUrls()
    if (urls.length == 0) return
    // stop beats
    urls.forEach(x => axios.put(x + '/stopBeat', {}).catch())
    startAlgorithm();
}

function startAlgorithm() {
    // do req > mi -> 2 
    let servers = getMajors()
    let idMajor = -1;
    servers.forEach(x => {
        axios.get(x.server + '/status')
            .then((data) => idMajor = x.id > idMajor ? x.id : idMajor)
            .catch((err))
    })
    if (idMajor == -1) notifyLeader()
    else {
        let newCandidate = servers.find(x => x.id == idMajor);
        axios.put(newCandidate.server + '/candidate', {}).then().catch();
    }
}

function notifyLeader() {
    // actualiza db yo lider 
    // servidores nuevo servidor reactiven beats
}

function getMajors() {
    return servers.filter(x => x.id > id);
}

//db
function getUrls() {
    return servers.map(x => x.server);
}

app.put('/candidate', (req, res)=>{
    startAlgorithm()
    res.sendStatus(200)
})


app.put('/stopBeat', (req, res) => {
    doBeat = false;
    res.sendStatus(200);
})

app.put('/newLeader', (req, res) => {
    doBeat = true;
    heartBeat();
    // read db
    res.sendStatus(200);
})

app.get('/status', (req, res) => res.sendStatus(200))

http.listen(port, () => {
    console.log('Client listening on port ', port);
});