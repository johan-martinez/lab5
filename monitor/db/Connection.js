const mongoose = require('mongoose');

const uri = "mongodb+srv://maicol:1234@cluster0.c7ppq.mongodb.net/lab5?retryWrites=true&w=majority";

const connectDB = async () => {
    await mongoose.connect(uri, { 
        useUnifiedTopology: true, 
        useNewUrlParser: true 
    });
}

module.exports = connectDB;