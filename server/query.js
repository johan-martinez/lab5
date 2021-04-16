let servers = [{ server: "http://localhost:3000", isLeader: false, id: 3000 },
{ server: "http://localhost:3001", isLeader: false, id: 3001 },
{ server: "http://localhost:3002", isLeader: false, id: 3002 }]

let imLeader = false;
let id = process.env.ID;

function getLeader() {
    return servers.find(x => x.isLeader).server
}

function getMyInfo(){
    global.myServer = servers.find(x => x.id == id)
}

function getMajors() {
    return servers.filter(x => x.id > id);
}

//db
function getUrls() {
    return servers.map(x => x.server);
}

function updateLeader(){
    servers.find(x => x.isLeader).isLeader = false;
    servers.find(x => x.id == id).isLeader = true;
    global.myServer.isLeader = true;
}


module.exports = {getLeader, getMajors, getUrls, getMyInfo, updateLeader};

