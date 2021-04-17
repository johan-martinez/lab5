const Server = require('./db/SeverModel')

let servers = [{ server: "http://localhost:3000", isLeader: true, id: 3000 },
{ server: "http://localhost:3001", isLeader: false, id: 3001 },
{ server: "http://localhost:3002", isLeader: false, id: 3002 }]

let id = process.env.ID;

function getLeader() {
    return servers.find(x => x.isLeader)
}

function getMyInfo() {
    global.myServer = servers.find(x => x.id == id)
}

function getMajors() {
    return servers.filter(x => x.id > id);
}

function getUrls() {
    
    Server.find({}, 'server', {}, (err, docs)=>{
        return err ? [] : docs;
    })
}

function updateLeader() {
    let leader =  servers.find(x => x.isLeader)
    if(leader) leader.isLeader = false
    servers.find(x => x.id == id).isLeader = true;
}

module.exports = {getLeader, getMajors, getUrls, getMyInfo, updateLeader};