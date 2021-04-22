require('./db/Connection')()
let shell = require('shelljs')

shell.exec('docker rm -f $(docker ps -a -q)');

let Server = require('./db/SeverModel')

Server.remove({},(err)=> console.log(err))