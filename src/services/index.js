const authService = require('./authService');
const userService = require('./userService');
const contactService = require('./contactService');
const notificationService = require('./notificationService');
const messageService = require('./messageService');
const groupChatService = require('./groupChatService');

const auth = authService;
const user = userService;
const contact = contactService;
const notification = notificationService;
const message = messageService;
const groupChat = groupChatService;

module.exports = {auth, user, contact, notification, message, groupChat};