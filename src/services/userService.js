const UserModel = require('./../models/userModel');
const {transErrors} = require('./../../lang/vi');
const bcrypt = require('bcrypt');

const saltRounds = 7;

/**
 * Update userInfo
 * @param {userId} id 
 * @param {data update} item 
 */
let updateUser = (id,item) =>{
    return UserModel.updateUser(id,item);
};


/**
 * 
 * @param {userId} id 
 * @param {data update} dataUpdate 
 */
let updatePassword = (id,dataUpdate) =>{
    return new Promise(async (resolve,reject)=>{
        let currentUser =  await UserModel.findUserByIdToUpdatePassword(id);
        if(!currentUser){
            return reject(transErrors.account_undefined);
        }

        let checkCurrentPassword = await currentUser.comparePassword(dataUpdate.currentPassword);
        if (!checkCurrentPassword) {
            return reject(transErrors.user_current_password_failed);
        } 

        let salt = bcrypt.genSaltSync(saltRounds);
        await UserModel.updatePassword(id,bcrypt.hashSync(dataUpdate.newPassword,salt));
        resolve(true);
    });
};

module.exports = {
    updateUser: updateUser,
    updatePassword: updatePassword
};
