const express = require('express');
const ConnectDB = require('./config/connectDB');
const configViewEngine = require('./config/viewEngine');
const initRoutes = require('./routes/web');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const session = require('./config/session');
const passport = require('passport');
const http = require('http');
const socketio = require('socket.io');
const initSockets = require('./sockets/index');
const cookieParser = require('cookie-parser');
const configSocketio = require('./config/socketio');
//const pem = require(' 'pem';
//const https = require(' 'https';
require('dotenv').config();
require('events').EventEmitter.prototype._maxListeners = 100;

let app = express();

//Init server with socket.io & express app
let server = http.createServer(app);
let io = socketio(server);

//Connect to mongodb
ConnectDB();

// Config Session
session.config(app);

//Config view engine
configViewEngine(app);

//Enable post data request
app.use(bodyParser.urlencoded({extended:true}));

//Enable Flash message
app.use(connectFlash());

//User cookie parser
app.use(cookieParser());

//Config passport js
app.use(passport.initialize());
app.use(passport.session());

//Init all routes
initRoutes(app);

//Config Socket.io
configSocketio(io, cookieParser, session.sessionStore);

//Init all sockets
initSockets(io);

// server.listen(process.env.APP_PORT,process.env.APP_HOSTNAME,()=>{
//     console.log(`running at ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`);
// });

server.listen(process.env.APP_PORT,process.env.APP_HOSTNAME,()=>{
    console.log(`running at port:${process.env.APP_PORT}`);
});

//facebook login 
// pem.config({
//     pathOpenSSL: 'C:\\Program Files\\OpenSSL-Win64\\bin\\openssl'
//   })
// pem.createCertificate({ days: 1, selfSigned: true }, function (err, keys) {
//     if (err) {
//       throw err;
//     }
//     let app = express();

//     //Connect to mongodb
//     ConnectDB();
    
//     // Config Session
//     configSession(app);
    
//     //Config view engine
//     configViewEngine(app);
    
//     //Enable post data request
//     app.use(bodyParser.urlencoded({extended:true}));
    
//     //Enable Flash message
//     app.use(connectFlash());
    
//     //Config passport js
//     app.use(passport.initialize());
//     app.use(passport.session());
    
//     //Init all routes
//     initRoutes(app);

//     https.createServer({ key: keys.serviceKey, cert: keys.certificate }, app).listen(process.env.APP_PORT,process.env.APP_HOSTNAME,()=>{
//         console.log(`running at ${process.env.APP_HOSTNAME}:${process.env.APP_PORT}`);
//     });
//   });
