const route = require('express').Router();
const axios = require('axios')
const query = require('./query');

let doBeat = true;

var sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

async function heartBeat() {
    await query.getMyInfo();
    let leader = query.getLeader();
    while (doBeat && !global.myServer.isLeader) {
        try {
            await axios.get(leader.server + '/algorithm/status')
            console.log('Leader OK', new Date(Date.now()));
        } catch {
            console.log('The leader is down, doing election ');
            await notifyElection();
        }
        await sleep(Math.random() * (10 - 2) + 2)
    }
}

async function notifyElection() {
    let urls = query.getUrls();
    if (urls.length == 0) return
    for (let i = 0; i < urls.length; i++) {
        let url = urls[i] + '/algorithm/stopBeat';
        try {
            await axios.put(url, {})
            console.log('Notify stop beats to ', urls[i])
        } catch (error) {
            console.log('Error notify stop beats to', urls[i])
        }
    }
    startAlgorithm();
}

async function startAlgorithm() {
    // do req > mi -> 2 
    let servers = query.getMajors()
    let idMajor = -1;
    for (let i = 0; i < servers.length; i++) {
        let url = servers[i].server + '/algorithm/status';
        try {
            await axios.get(url)
            idMajor = servers[i].id > idMajor ? servers[i].id : idMajor
            console.log('Server major response election', servers[i])
        } catch (error) {
            console.log('Error server major not response election', servers[i])
        }
    }
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
        axios.put(x + '/algorithm/newLeader')
            .then((data) => console.log('Notify new leader to', x))
            .catch((err) => console.log('Error notify new leader to', x))
    })
}

route.put('/candidate', (req, res) => {
    startAlgorithm()
    res.sendStatus(200)
})


route.put('/stopBeat', (req, res) => {
    doBeat = false;
    res.sendStatus(200);
})

route.put('/newLeader', (req, res) => {
    doBeat = true;
    query.getMyInfo()
    heartBeat();
    res.sendStatus(200);
})

route.get('/status', (req, res) => res.sendStatus(200))

module.exports = { route, heartBeat };