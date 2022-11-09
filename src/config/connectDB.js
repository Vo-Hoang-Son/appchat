const mongoose = require('mongoose');
const bluebird = require('bluebird');
require("dotenv").config();
/**
 * Connect to MongoDB
 */
/*let connectDB = () => {
    mongoose.Promise = bluebird;

    // mongodb://localhost:27017/awesome_chat
    let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

    //let URI = `mongodb://awesomechat10:awesomechat10@awesomechat-shard-00-00.hsuap.mongodb.net:27017,awesomechat-shard-00-01.hsuap.mongodb.net:27017,awesomechat-shard-00-02.hsuap.mongodb.net:27017/awesomechat?ssl=true&replicaSet=atlas-uz5soo-shard-0&authSource=admin&retryWrites=true&w=majority`;
    
    return mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
};*/

let URI = `${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

async function connectDB() {
    try {
        await mongoose.connect(URI, {useNewUrlParser: true, useUnifiedTopology: true});
        console.log("Connected");
    } catch (e) {
        console.log("Connect faild");
    }
}

module.exports = connectDB;
