const route = require('express').Router();
const axios = require('axios')
const query = require('./query');

let doBeat = true;

var sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function heartBeat() {
    query.getMyInfo();
    while (doBeat && !global.myServer.isLeader) {
        let leader = query.getLeader();
        console.log(leader);
        try {
            await axios.get(leader + '/algorithm/status')
        } catch {
            notifyElection();
            doBeat = false;
        }
        await sleep(Math.random() * (10 - 2) + 2)
    }
}

function notifyElection() {
    let urls = query.getUrls();
    if (urls.length == 0) return
    // stop beats
    urls.forEach(x => axios.put(x + '/algorithm/stopBeat', {}).catch())
    startAlgorithm();
}

function startAlgorithm() {
    // do req > mi -> 2 
    let servers = query.getMajors()
    let idMajor = -1;
    servers.forEach(x => {
        axios.get(x.server + '/algorithm/status')
            .then((data) => idMajor = x.id > idMajor ? x.id : idMajor)
            .catch((err))
    })
    if (idMajor == -1) notifyLeader()
    else {
        let newCandidate = servers.find(x => x.id == idMajor);
        axios.put(newCandidate.server + '/algorithm/candidate', {}).then().catch();
    }
}

function notifyLeader() {
    // actualiza db yo lider -- falta
    query.updateLeader();
    // servidores nuevo servidor reactiven beats
    let servers = query.getUrls();
    servers.forEach(x => {
        axios.put(x + '/algorithm/newLeader').then().catch((err))
    })

    ///
}


route.put('/candidate', (req, res)=>{
    startAlgorithm()
    res.sendStatus(200)
})


route.put('/stopBeat', (req, res) => {
    doBeat = false;
    res.sendStatus(200);
})

route.put('/newLeader', (req, res) => {
    doBeat = true;
    heartBeat();
    // read db
    res.sendStatus(200);
})

route.get('/status', (req, res) => res.sendStatus(200))

module.exports = {route, heartBeat};