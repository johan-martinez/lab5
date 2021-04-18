const axios  = require("axios");
const fs = require('fs');
const Server = require('./db/SeverModel');

var servers=[]
var leader={}

async function getUrls() {
    try {
        return await Server.find({}, 'server id').exec()
    } catch (error) { return await getUrls() }
}

async function saveData(info){
    try{
        let serverModel = new Server(info)
        await serverModel.save()
    }catch (error) { return await saveData() }
}

async function getLeader() {
    try {
        return await Server.findOne({ isLeader: { $eq: true } }, 'server').exec();
    } catch (error) { return await getLeader() }
}

async function getIdMajor(){
    try{
        return await Server.findOne({}).sort('-id').exec();
    }catch (error) { await getIdMajor() }
}

setInterval(async()=>{
    servers=await getUrls()
    previusLeader=leader
    leader= await getLeader()
},3000)

var monitor=[]
async function monitoring(){
    monitor=[]
    servers.map((element,i) => {
        axios.get(`${element.server}/status`)
        .then((result) => {
            var isl=element.server==leader.server
            monitor.push({server:element.server,isLeader:isl,online: true})
        }).catch((err) => {
            var isl=element.server==leader.server
            monitor.push({server:element.server,isLeader:isl,online: false})
        })
    });
}

setInterval(async ()=>{
    if (monitor.length!=0) 
        fs.writeFileSync('monitoring.json',JSON.stringify(monitor))
    await monitoring()
},10000)

module.exports = {getIdMajor,saveData};