const Server = require('./db/SeverModel')

let servers = [{ server: "http://localhost:3000", isLeader: true, id: 3000 },
{ server: "http://localhost:3001", isLeader: false, id: 3001 },
{ server: "http://localhost:3002", isLeader: false, id: 3002 }]

let id = process.env.ID;

async function getLeader() {
    global.myServer = await Server.find({isLeader:{$eq:true}}, 'server', {}, (err, docs)=>{
        return err ? [] : docs;
    })
   // return servers.find(x => x.isLeader)
}

async function getMyInfo() {
    global.myServer = await Server.find({id:{$eq:this.id}}, 'server', {}, (err, docs)=>{
        return err ? [] : docs;
    })

//    global.myServer = servers.find(x => x.id == id)
}

async function getMajors() {
    return await Server.find({id:{$eq:this.id}}, 'server', {}, (err, docs)=>{
        return err ? [] : docs;
    })

   // return servers.filter(x => x.id > id);
}

async function getUrls() {
    
    await Server.find({}, 'server', {}, (err, docs)=>{
        return err ? [] : docs;
    })
}

async function updateLeader() {
    //let leader =  servers.find(x => x.isLeader)
   // if(leader) leader.isLeader = false
    //servers.find(x => x.id == id).isLeader = true;
    let leader = getLeader();
    if(leader){
        await Server.updateOne({isLeader:{$eq:true}}, {isLeader:false}, (err, docs)=>{
            return err ? [] : docs;
        })
    } 
    await Server.updateOne({id:{$eq:this.id}}, {isLeader:true}, (err, docs)=>{
        return err ? [] : docs;
    })
}

module.exports = {getLeader, getMajors, getUrls, getMyInfo, updateLeader};