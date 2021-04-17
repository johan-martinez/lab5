const mongoose = require('mongoose')
const connection = require('./Connection');
connection()
const server = mongoose.Schema({
    server: {
        type: String
    },
    isLeader: {
        type: Boolean
    },
    id: {
        type: Number
    }
});

module.exports = Server = mongoose.model('server', server)