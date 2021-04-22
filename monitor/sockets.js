const io = require("socket.io-client");
const logger = require('./logger');
const shell = require('shelljs');

global.monitoring = {}

function init(urls) {
    urls.forEach(x => addServer(x.server));
}

function addServer(url_server){
    var socket = io(url_server).connect();
    monitoring[url_server] = {server:url_server, isLeader: false, online: false}
    socket.on('data-server', data => {
        monitoring[url_server].isLeader = data.isLeader
        monitoring[url_server].online = true
    })
    socket.on('send-log', data=>{
        logger.info(String(data))
    })
    socket.on('disconnect', () => {
        monitoring[url_server].online = false
        monitoring[url_server].isLeader = false
    })
    socket.on('stop', data => {
        shell.exec(`docker stop Server${String(data)}`)       
    });
}

module.exports = {addServer, init}