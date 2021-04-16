const axios  = require("axios");
const fs = require('fs');

var monitor=[]
function monitoring(){
    monitor=[]
    global.servers.forEach(element => {
        let online=false
        axios.get(`${element.server}/test`)
        .then((result) => {
            online = true
            return
        }).catch((err) => {
            online = false
            return
        })
        .finally(()=>{
            monitor.push({server:element.server,isLeader:element.isLeader,online: online})
        })
        
    });
}

setInterval(async ()=>{
    if (monitor.length!=0) 
        fs.writeFileSync('monitoring.json',JSON.stringify(monitor))
    monitoring()
},5000)

