require('./db/Connection')()
var Server = require('./db/SeverModel')

async function getUrls() {
    try {
        let result = await Server.find({isLeader: true}, 'server isLeader id').exec()
        return result
    } catch (error) {
        return await getUrls()
    }
}

async function init(){
    console.log(await getUrls());

} 
init()