const authValidation = require('./authValidation');
const userValidation = require('./userValidation');
const contactValidation = require('./contactValidation');
const messageValidation = require('./messageValidation');
const groupChatValidation = require('./groupChatValidation');

const authValid = authValidation;
const userValid = userValidation;
const contactValid = contactValidation;
const messageValid = messageValidation;
const groupChatValid = groupChatValidation;

module.exports = {authValid, userValid, contactValid, messageValid, groupChatValid};
