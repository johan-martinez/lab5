const axios = require('axios')
const query = require('./query');
const fs = require('fs')

global.doBeat = true;

var sleep = (s) => new Promise((resolve) => setTimeout(resolve, s*1000));

// all console.log send with ws

async function heartBeat() {
    await query.getMyInfo();
    let leader = await query.getLeader();
    try {
        while (doBeat && !global.myServer.isLeader) {
            await axios.get(leader.server + '/status')
            let log = `[INFO] ${new Date(Date.now()).toISOString()} [Request]: GET ${leader.server} [Response]: Leader OK\n`;
            fs.appendFileSync('./logs/access.log', log.toString())
            await sleep(Math.random() * 5 + 5)
        }
    } catch (error){
        global.socket.emit('send-log', process.env.ID + ': The leader is down, doing election ');
        await notifyElection();
    }
}

async function notifyElection() {
    let urls = await query.getUrls();
    for (let i = 0; i < urls.length; i++) {
        let url = urls[i].server + '/stopBeat';
        try {
            await axios.put(url, {})
            global.socket.emit('send-log', process.env.ID + `: Notify stop beats to ${urls[i].server}`)
        } catch (error) {
            global.socket.emit('send-log', process.env.ID + `: Error notify stop beats to ${urls[i].server}`)
        }
    }
    await startAlgorithm();
}

async function startAlgorithm() {
    global.socket.emit('send-log', process.env.ID + ': Init Election...');
    let servers = await query.getMajors()
    let idMajor = -1;
    for (let i = 0; i < servers.length; i++) {
        let url = servers[i].server + '/status';
        try {
            await axios.get(url)
            idMajor = servers[i].id > idMajor ? servers[i].id : idMajor
            global.socket.emit('send-log', process.env.ID + `: Server major response election ${servers[i].server}`)
        } catch (error) {
            global.socket.emit('send-log', process.env.ID + `: Error server major not response election ${servers[i].server}`)
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
    for (let i = 0; i < servers.length; i++) {
        let url = servers[i].server + '/newLeader';
        try {
            await axios.put(url, {})
            global.socket.emit('send-log', process.env.ID + `: Notify new leader to  ${servers[i].server}`)
        } catch (error) {
            global.socket.emit('send-log', process.env.ID + `: Error notify new leader to${servers[i].server}`)
        }
    }
    global.socket.emit('send-log', `${process.env.ID}: Algorithm Finish`)    
}

module.exports = { startAlgorithm, heartBeat };