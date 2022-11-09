const ContactModel = require('./../models/contactModel');
const UserModel = require('./../models/userModel');
const ChatGroupModel = require('./../models/chatGroupModel');
const MessageModel = require('./../models/messageModel');
const _ = require('lodash');
const { transErrors } = require('../../lang/vi');
const {app} = require('./../config/app');
const fsExtra = require('fs-extra');

const LIMIT_CONVERSATIONS_TAKEN = 15;
const LIMIT_MESSAGE_TAKEN = 30;

let getAllConversationItems = (currentUserId) =>{
    return new Promise( async(resolve,reject) =>{
        try {
            let contacts = await ContactModel.getContacts(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map(async (contact) =>{
                if (contact.contactId == currentUserId) {
                    let getUserContact =  await UserModel.getNormalUserDataById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }else{
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });

            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.getChatGroups(currentUserId,LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations,(item)=>{
                return -item.updatedAt;      
            });

            let allConversationsWithMessagesPromise = allConversations.map(async(conversation)=>{
                conversation = conversation.toObject();

                if(conversation.members){
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }else{
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }

                return conversation;
            });

            let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
            allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item)=>{
                return -item.updatedAt;
            });
            
            resolve({
                allConversationsWithMessages: allConversationsWithMessages
            });
        } catch (error) {
            reject(error);
        }
    });
};

let addNewTextEmoji = (sender,receiverId,messageVal,isChatGroup) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.GROUP,
                    messageType: MessageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.TEXT,
                    sender: sender,
                    receiver: receiver,
                    text: messageVal,
                    createdAt: Date.now(),
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let addNewImage = (sender,receiverId,messageVal,isChatGroup) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.GROUP,
                    messageType: MessageModel.messageType.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file:{data: imageBuffer, contentType: imageContentType, fileName:imageName},
                    createdAt: Date.now(),
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                let imageBuffer = await fsExtra.readFile(messageVal.path);
                let imageContentType = messageVal.mimetype;
                let imageName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.IMAGE,
                    sender: sender,
                    receiver: receiver,
                    file:{data: imageBuffer, contentType: imageContentType, fileName:imageName},
                    createdAt: Date.now(),
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let addNewAttachment = (sender,receiverId,messageVal,isChatGroup) =>{
    return new Promise(async(resolve,reject)=>{
        try {
            if(isChatGroup){
                let getChatGroupReceiver = await ChatGroupModel.getChatGroupById(receiverId);
                if (!getChatGroupReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getChatGroupReceiver._id,
                    name: getChatGroupReceiver.name,
                    avatar: app.general_avatar_group_chat
                };
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.GROUP,
                    messageType: MessageModel.messageType.FILE,
                    sender: sender,
                    receiver: receiver,
                    file:{data: attachmentBuffer, contentType: attachmentContentType, fileName:attachmentName},
                    createdAt: Date.now(),
                };

                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ChatGroupModel.updateWhenHasNewMessage(getChatGroupReceiver._id,getChatGroupReceiver.messageAmount + 1);
                resolve(newMessage);
            }else{
                let getUserReceiver = await UserModel.getNormalUserDataById(receiverId);
                if (!getUserReceiver) {
                    return reject(transErrors.coversation_not_found);
                }
                let receiver = {
                    id: getUserReceiver._id,
                    name: getUserReceiver.username,
                    avatar: getUserReceiver.avatar
                };
                let attachmentBuffer = await fsExtra.readFile(messageVal.path);
                let attachmentContentType = messageVal.mimetype;
                let attachmentName = messageVal.originalname;

                let newMessageItem = {
                    senderId: sender.id,
                    receiverId: receiver.id,
                    conversationType: MessageModel.conversationType.PERSONAL,
                    messageType: MessageModel.messageType.FILE,
                    sender: sender,
                    receiver: receiver,
                    file:{data: attachmentBuffer, contentType: attachmentContentType, fileName:attachmentName},
                    createdAt: Date.now(),
                };
                let newMessage = await MessageModel.model.createNew(newMessageItem);
                await ContactModel.updateWhenHasNewMessage(sender.id,getUserReceiver._id);
                resolve(newMessage);
            }
        } catch (error) {
            reject(error);
        }
    });
};

let readMoreAllChat = (currentUserId,skipPersonal,skipGroup) =>{
    return new Promise( async(resolve,reject) =>{
        try {
            let contacts = await ContactModel.readMoreContacts(currentUserId,skipPersonal,LIMIT_CONVERSATIONS_TAKEN);
            let userConversationsPromise = contacts.map(async (contact) =>{
                if (contact.contactId == currentUserId) {
                    let getUserContact =  await UserModel.getNormalUserDataById(contact.userId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }else{
                    let getUserContact = await UserModel.getNormalUserDataById(contact.contactId);
                    getUserContact.updatedAt = contact.updatedAt;
                    return getUserContact;
                }
            });

            let userConversations = await Promise.all(userConversationsPromise);
            let groupConversations = await ChatGroupModel.readMoreChatGroups(currentUserId,skipGroup,LIMIT_CONVERSATIONS_TAKEN);
            let allConversations = userConversations.concat(groupConversations);
            allConversations = _.sortBy(allConversations,(item)=>{
                return -item.updatedAt;      
            });

            let allConversationsWithMessagesPromise = allConversations.map(async(conversation)=>{
                conversation = conversation.toObject();

                if(conversation.members){
                    let getMessages = await MessageModel.model.getMessagesInGroup(conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }else{
                    let getMessages = await MessageModel.model.getMessagesInPersonal(currentUserId,conversation._id,LIMIT_MESSAGE_TAKEN);
                    conversation.messages = _.reverse(getMessages);
                }

                return conversation;
            });

            let allConversationsWithMessages = await Promise.all(allConversationsWithMessagesPromise);
            allConversationsWithMessages = _.sortBy(allConversationsWithMessages, (item)=>{
                return -item.updatedAt;
            });
            
            resolve(allConversationsWithMessages);
        } catch (error) {
            reject(error);
        }
    });
};

let readMore = (currentUserId,skipMessage,targetId,chatInGroup) =>{
    return new Promise( async(resolve,reject) =>{
        try {
            //message in group
            if(chatInGroup){
                let getMessages = await MessageModel.model.readMoreMessagesInGroup(targetId,skipMessage,LIMIT_MESSAGE_TAKEN);
                getMessages = _.reverse(getMessages);

                return resolve(getMessages);
            }
            //message in personal
            let getMessages = await MessageModel.model.readMoreMessagesInPersonal(currentUserId,targetId,skipMessage,LIMIT_MESSAGE_TAKEN);
            getMessages = _.reverse(getMessages);

            return resolve(getMessages);
        } catch (error) {
            reject(error);
        }
    });
};

module.exports = {
    getAllConversationItems: getAllConversationItems,
    addNewTextEmoji: addNewTextEmoji,
    addNewImage: addNewImage,
    addNewAttachment: addNewAttachment,
    readMoreAllChat: readMoreAllChat,
    readMore: readMore
};
