const homeController = require('./homeController');
const authController = require('./authController');
const userController = require('./userController');
const contactController = require('./contactController');
const notificationController = require('./notificationController');
const messageController = require('./messageController');
const groupChatController = require('./groupChatController');

const home = homeController;
const auth = authController;
const user = userController;
const contact = contactController;
const notification = notificationController;
const message = messageController;
const groupChat = groupChatController;

module.exports = {home, auth, user, contact, notification, message, groupChat};
