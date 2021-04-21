const Server = require('./db/SeverModel');

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

async function getIdMajor(){
    try{
        return await Server.findOne({}).sort('-id').exec();
    }catch (error) { await getIdMajor() }
}

module.exports = {getIdMajor, saveData, getUrls}