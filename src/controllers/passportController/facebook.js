const passport = require('passport');
const passportFacebook = require('passport-facebook');
const UserModel = require('./../../models/userModel');
const ChatGroupModel = require('./../../models/chatGroupModel');
const {transErrors,transSuccess} = require('./../../../lang/vi');
require("dotenv").config();

let FacebookStrategy = passportFacebook.Strategy;

let fbAppId = process.env.FB_APP_ID;
let fbAppSecret = process.env.FB_APP_SECRET;
let fbCallbackUrl = process.env.FB_CALLBACK_URL;

/**
 * Valid user facebook account 
 */
let initPassportFacebook = () =>{
    passport.use(new FacebookStrategy({
        clientID: fbAppId,
        clientSecret: fbAppSecret,
        callbackURL: fbCallbackUrl,
        passReqToCallback: true,
        profileFields:["email", "gender", "displayName"]
    }, async (req,accessToken,refreshToken,profile,done)=>{
        try {
            let user = await UserModel.findByFacebookUid(profile.id);
            if (user) {
                return done(null,user,req.flash("success", transSuccess.login_success(user.username)));
            }
            
            let newUserItem = {
                username: profile.displayName,
                gender: profile.gender,
                local: {isActive: true},
                facebook: {
                    uid: profile.id,
                    token: accessToken,
                    email: profile.emails[0].value
                }    
            };

            let newUser = await UserModel.createNew(newUserItem);
            return done(null,newUser,req.flash("success", transSuccess.login_success(newUser.username)));
        } catch (error) {
            console.log(error);
            return done(null,false,req.flash("errors",transErrors.server_error));
        }
    }));
    //save user id to session
    passport.serializeUser((user,done)=>{
        done(null, user._id);
    });

    passport.deserializeUser(async (id,done)=>{
        try {
            let user = await UserModel.findUserByIdForSessionToUse(id);
            let getChatGroupIds = await ChatGroupModel.getChatGroupIdsByUser(user._id);

            user = user.toObject();
            user.chatGroupIds = getChatGroupIds;
            return done(null,user);
        } catch (error) {
            return done(error,null);
        }
    });
};

module.exports = initPassportFacebook;
