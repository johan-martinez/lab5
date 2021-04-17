const axios = require('axios')
const query = require('./query');

global.doBeat = true;

var sleep = (seconds) => new Promise((resolve) => setTimeout(resolve, seconds * 1000));

// all console.log send with ws

async function heartBeat() {
    await query.getMyInfo();
    let leader = await query.getLeader();
    try {
        while (doBeat && !global.myServer.isLeader) {
            await axios.get(leader.server + '/status')
            console.log('Leader OK', new Date(Date.now()));
            await sleep(Math.random() * (10 - 5) + 5)
        }
    } catch {
        console.log('The leader is down, doing election ');
        await notifyElection();
    }
}

async function notifyElection() {
    let urls = await query.getUrls();
    for (let i = 0; i < urls.length; i++) {
        let url = urls[i].server + '/stopBeat';
        try {
            await axios.put(url, {})
            console.log('Notify stop beats to ', urls[i].server)
        } catch (error) {
            console.log('Error notify stop beats to', urls[i].server)
        }
    }
    await startAlgorithm();
}

async function startAlgorithm() {
    console.log('Init Election...');
    let servers = await query.getMajors()
    let idMajor = -1;
    for (let i = 0; i < servers.length; i++) {
        let url = servers[i].server + '/status';
        try {
            await axios.get(url)
            idMajor = servers[i].id > idMajor ? servers[i].id : idMajor
            console.log('Server major response election', servers[i].server)
        } catch (error) {
            console.log('Error server major not response election', servers[i].server)
        }
    }
    if (idMajor == -1) await notifyLeader()
    else {
        let newCandidate = servers.find(x => x.id == idMajor);
        axios.put(newCandidate.server + '/candidate', {}).then().catch();
    }
}

async function notifyLeader() {
    // actualiza db yo lider -- falta
    await query.updateLeader();
    // servidores nuevo servidor reactiven beats
    let servers = await query.getUrls();
    servers.forEach(x => {
        axios.put(x.server + '/newLeader')
            .then((data) => console.log('Notify new leader to', x.server))
            .catch((err) => console.log('Error notify new leader to', x.server))
    })
}

module.exports = { startAlgorithm, heartBeat };