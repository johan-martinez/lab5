const Server = require('./db/SeverModel')

let id = parseInt(process.env.ID);

async function getLeader() {
    try {
        return await Server.findOne({ isLeader: { $eq: true } }, 'server').exec();
    } catch (error) { return await getLeader() }
}

async function getMyInfo() {
    try {
        global.myServer = await Server.findOne({ id: { $eq: id } }).exec()
    } catch (error) { await getMyInfo() }
}

async function getMajors() {
    try {
        return await Server.find({ id: { $gt: id } }).exec()
    } catch (error) { return await getMajors() }
}

async function getUrls() {
    try {
        return await Server.find({}, 'server id').exec()
    } catch (error) { return await getUrls() }
}

async function updateLeader() {
    try {
        let leader = await getLeader()
        if(leader && leader.id == id) return
        await Server.updateOne({ isLeader: { $eq: true } }, { isLeader: false }).exec()
        await Server.updateOne({ id: { $eq: id } }, { isLeader: true }).exec()
        await getMyInfo()
    } catch (error) { }
}

module.exports = { getLeader, getMajors, getUrls, getMyInfo, updateLeader };