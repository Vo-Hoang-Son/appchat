const {check} = require('express-validator/check');
const {transValidation} = require('./../../lang/vi');

let updateInfo = [
    check("username", transValidation.update_username)
        .optional()
        .isLength({min: 2, max: 25})
        .matches(/^[\s0-9a-zA-Z_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂưăạảấầẩẫậắằẳẵặẹẻẽềềểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹ ]+$/),
    check("gender", transValidation.update_gender)
        .optional()
        .isIn(["male","female"]),
    check("address", transValidation.update_address)
        .optional()            
        .isLength({min: 5, max: 50}),
    check("phone",transValidation.update_phone)
        .optional()
        .matches(/^(0)[0-9]{9,10}$/),    
];

let updatePassword = [
    check("currentPassword",transValidation.password_incorrect)
        .isLength({min: 6}),
    check("newPassword",transValidation.password_incorrect)
        .isLength({min: 6}), 
    check("confirmNewPassword",transValidation.password_confirmation_incorrect)
        .custom((value,{req})=> value === req.body.newPassword)        
];

module.exports = {
    updateInfo: updateInfo,
    updatePassword: updatePassword
};
