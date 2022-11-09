const {validationResult} = require('express-validator/check');
const {auth} = require('./../services/index');
const {transSuccess} = require('./../../lang/vi');

let getLoginRegister = (req,res)=>{
    return res.render("auth/master", {
        errors: req.flash("errors"),
        success: req.flash("success")
    });
};

let postRegister = async (req,res) =>{    
    let errorArr = [];
    let successArr = [];
    let validationErrors = validationResult(req);
    if(!validationErrors.isEmpty()){
        let errors = Object.values(validationErrors.mapped());
        errors.forEach(item => {
            errorArr.push(item.msg);
        });
        req.flash("errors", errorArr);
        return res.redirect("/loginRegister");
    }
    try {
        let createUserSuccess =  await auth.register(req.body.email, req.body.username, req.body.phone, req.body.gender, req.body.password,req.protocol,req.get("host"));   
        successArr.push(createUserSuccess);
        req.flash("success", successArr);
        return res.redirect("/loginRegister");         
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr);
        return res.redirect("/loginRegister");           
    }
};

let verifyAccount = async (req,res) =>{
    let errorArr = [];
    let successArr = [];    
    try {
        let verifySuccess = await auth.verifyAccount(req.params.token)
        successArr.push(verifySuccess);
        req.flash("success", successArr);
        return res.redirect("/loginRegister"); 
    } catch (error) {
        errorArr.push(error);
        req.flash("errors", errorArr);
        return res.redirect("/loginRegister");
    }
};

let getLogout = (req,res) =>{
    req.logout(); //remove session passport user
    req.flash("success", transSuccess.logout_success);
    return res.redirect("/loginRegister");
};

let checkLoggedIn = (req,res,next) =>{
    if(!req.isAuthenticated()){
        return res.redirect("/loginRegister");
    }
    next();
};

let checkLoggedOut = (req,res,next) =>{
    if(req.isAuthenticated()){
        return res.redirect("/");
    }
    next();
};

module.exports = {
    getLoginRegister: getLoginRegister,
    postRegister: postRegister,
    verifyAccount: verifyAccount,
    getLogout: getLogout,
    checkLoggedIn: checkLoggedIn,
    checkLoggedOut: checkLoggedOut
};
