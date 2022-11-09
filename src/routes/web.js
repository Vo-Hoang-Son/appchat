const express = require('express');
const {home, auth, user, contact,notification,message,groupChat} = require('./../controllers/index');
const {authValid,userValid, contactValid, messageValid,groupChatValid} = require('./../validation/index');
const passport = require('passport');
const initPassportLocal = require('./../controllers/passportController/local');
const initPassportFacebook = require('./../controllers/passportController/facebook');

//Init all passport
initPassportLocal();
initPassportFacebook();

let router = express.Router();

/**
 * Init all routes
 * @param app = require(' exactly express module
 */
let initRoutes = (app) =>{

    router.get("/loginRegister",auth.checkLoggedOut,auth.getLoginRegister);
    router.post("/register",auth.checkLoggedOut,authValid.register,auth.postRegister);
    router.get("/verify/:token",auth.checkLoggedOut,auth.verifyAccount);

    router.post("/login", auth.checkLoggedOut,passport.authenticate("local",{
        successRedirect: "/",
        failureRedirect: "/loginRegister",
        successFlash: true,
        failureFlash: true
    }));   

    router.get("/auth/facebook",passport.authenticate("facebook", {scope:["email"]}));
    router.get("/auth/facebook/callback",passport.authenticate("facebook",{
        successRedirect: "/",
        failureRedirect: "/loginRegister"
    }));

    router.get("/",auth.checkLoggedIn,home.getHome);
    router.get("/logout",auth.checkLoggedIn ,auth.getLogout);

    router.put("/user/update-avatar",auth.checkLoggedIn, user.updateAvatar);
    router.put("/user/update-info",auth.checkLoggedIn,userValid.updateInfo,user.updateInfo);
    router.put("/user/update-password",auth.checkLoggedIn,userValid.updatePassword,user.updatePassword);

    router.get("/contact/find-users/:keyword",auth.checkLoggedIn,contactValid.findUsersContact,contact.findUsersContact);
    router.post("/contact/add-new",auth.checkLoggedIn,contact.addNew);
    router.delete("/contact/remove-contact",auth.checkLoggedIn,contact.removeContact);
    router.delete("/contact/remove-request-contact-sent",auth.checkLoggedIn,contact.removeRequestContactSent);
    router.delete("/contact/remove-request-contact-received",auth.checkLoggedIn,contact.removeRequestContactReceived);
    router.put("/contact/approve-request-contact-received",auth.checkLoggedIn,contact.approveRequestContactReceived);
    router.get("/contact/read-more-contacts",auth.checkLoggedIn,contact.readMoreContacts);
    router.get("/contact/read-more-contacts-sent",auth.checkLoggedIn,contact.readMoreContactsSent);
    router.get("/contact/read-more-contacts-received",auth.checkLoggedIn,contact.readMoreContactsReceived);
    router.get("/contact/search-friends/:keyword",auth.checkLoggedIn,contactValid.searchFriends,contact.searchFriends);
    router.get("/notification/read-more",auth.checkLoggedIn,notification.readMore);
    router.put("/notification/mark-all-as-read",auth.checkLoggedIn,notification.markAllAsRead);
    router.post("/message/add-new-text-emoji",auth.checkLoggedIn,messageValid.checkMessageLength,message.addNewTextEmoji);
    router.post("/message/add-new-image",auth.checkLoggedIn,message.addNewImage);
    router.post("/message/add-new-attachment",auth.checkLoggedIn,message.addNewAttachment);
    router.get("/message/read-more-all-chat",auth.checkLoggedIn,message.readMoreAllChat);
    router.get("/message/read-more",auth.checkLoggedIn,message.readMore);
    router.post("/group-chat/add-new",auth.checkLoggedIn,groupChatValid.addNewGroup,groupChat.addNewGroup);
    return app.use("/",router);
};

module.exports = initRoutes;
