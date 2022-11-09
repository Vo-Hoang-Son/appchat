const session = require('express-session');
const connectMongo = require('connect-mongo');
require("dotenv").config();

let MongoStore = connectMongo(session);

/**
 * This variable is where save session 
 */
let sessionStore = new MongoStore({
    url:`${process.env.DB_CONNECTION}://${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`,
   // url:`mongodb://awesomechat10:awesomechat10@awesomechat-shard-00-00.hsuap.mongodb.net:27017,awesomechat-shard-00-01.hsuap.mongodb.net:27017,awesomechat-shard-00-02.hsuap.mongodb.net:27017/awesomechat?ssl=true&replicaSet=atlas-uz5soo-shard-0&authSource=admin&retryWrites=true&w=majority`,
    autoReconnect: true
});

/**
 * Config session for app
 * @param app = require(' exacly express module
 */
let config = (app)=>{
    app.use(session({
        key: process.env.SESSION_KEY,
        secret: process.env.SESSION_SECRET,
        store: sessionStore,
        resave: true,
        saveUninitialized: false,
        cookie:{
            maxAge: 1000 * 60 * 60 * 24 //86400000s = 1 day
        } 
    }));
};

module.exports = {
    config: config,
    sessionStore: sessionStore
};
