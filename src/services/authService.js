const UserModel = require('./../models/userModel');
const bcrypt = require('bcrypt');
const uuidv4 = require('uuid/v4');
const {transErrors,transSuccess,transMail} = require('./../../lang/vi');
const sendMail = require('./../config/mailer');

let saltRounds = 7;

let register =  (email,username,phone, gender,password,protocol, host) => {
    return new Promise( async (resolve,reject) =>{
        let userByEmail = await UserModel.findByEmail(email);
            if(userByEmail){
                if (userByEmail.deletedAt != null) {
                    return reject(transErrors.account_removed);
                }
                if (!userByEmail.local.isActive) {
                    return reject(transErrors.account_not_active);
                }                
                return reject(transErrors.account_in_use);
        }
        let salt = bcrypt.genSaltSync(saltRounds);
        let userItem = {
            username: username,
            phone: phone,
            gender: gender,
            local:{
                email: email,
                password: bcrypt.hashSync(password, salt),
                verifyToken: uuidv4()
            }
        };
        let user = await UserModel.createNew(userItem);
        let linkVerify = `${protocol}://${host}/verify/${user.local.verifyToken}`;
        //send mail
        sendMail(email, transMail.subject,transMail.template(linkVerify))
            .then(success =>{
                resolve(transSuccess.userCreated(user.local.email));
            })
            .catch(async (error)=>{
                //remove user
                await UserModel.removeById(user._id);
                console.log(error);
                reject(transMail.send_fail);
            });
        
    }); 
};

let verifyAccount = (token) => {
    return new Promise( async (resolve, reject) =>{
        let UserByToken = await UserModel.findByToken(token);
        if (!UserByToken) {
            return reject(transErrors.token_undifined);
        }
        await UserModel.verify(token);
        resolve(transSuccess.account_activated);
    });
};

module.exports = {
    register: register,
    verifyAccount: verifyAccount
};
