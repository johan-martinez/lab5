const mongoose = require('mongoose')

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