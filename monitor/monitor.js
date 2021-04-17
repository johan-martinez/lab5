const axios  = require("axios");
const fs = require('fs');

const Server = require('./db/SeverModel');

var servers=[]
var leader

async function getUrls() {
    try {
        return await Server.find({}, 'server id').exec()
    } catch (error) { return await getUrls() }
}

async function getLeader() {
    try {
        return await Server.findOne({ isLeader: { $eq: true } }, 'server').exec();
    } catch (error) { return await getLeader() }
}

setInterval(async()=>{
    servers=await getUrls()
    leader= await getLeader()
},3000)

var monitor=[]
async function monitoring(){
    monitor=[]
    servers.forEach(element => {
        var online=false
        axios.get(`${element.server}/status`)
        .then((result) => {
            online = true
            var isl=element.server==leader.server
            console.log({server:element.server,isLeader:isl,online: online})
            monitor.push({server:element.server,isLeader:isl,online: online})
        }).catch((err) => {
            online = false
            var isl=element.server==leader.server
            console.log({server:element.server,isLeader:isl,online: online})
            monitor.push({server:element.server,isLeader:isl,online: online})
        })
    });
}

setInterval(async ()=>{
    await monitoring()
    if (monitor.length!=0) 
        fs.writeFileSync('monitoring.json',JSON.stringify(monitor))
},10000)

