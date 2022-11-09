function textAndEmojiChat(divId) {
    $(".emojionearea").unbind("keyup").on("keyup",function(element) {
        let currentEmojioneArea = $(this);
        if (element.which === 13) {
            let targetId = $(`#write-chat-${divId}`).data("chat");
            let messageVal = $(`#write-chat-${divId}`).val(); 

            if (!targetId.length || !messageVal.length) {
                return false;
            }

            let dataTextEmojiForSend = {
                uid: targetId,
                messageVal: messageVal
            };

            if ($(`#write-chat-${divId}`).hasClass("chat-in-group")) {
                dataTextEmojiForSend.isChatGroup = true;
            }

            $.post("/message/add-new-text-emoji", dataTextEmojiForSend,function(data){
                let dataToEmit = {
                    message: data.message
                };
                //handle message data before show
                let messageOfMe = $(`<div class="convert-emoji bubble me" data-mess-id="${data.message._id}"></div>`);
                messageOfMe.text(data.message.text);
                let convertEmojiMessage = emojione.toImage(messageOfMe.html());
                if (dataTextEmojiForSend.isChatGroup) {
                    let username = '<h5 style="color: black;">'+data.message.sender.name+'</h5>';
                    let senderAvatar = `<img src="/images/users/${data.message.sender.avatar}" class="avatar-small" title="${data.message.sender.name}"/>`;
                    messageOfMe.html(`${username} ${senderAvatar} ${convertEmojiMessage}`);
                    increaseNumberMessageGroup(divId);
                    dataToEmit.groupId = targetId;
                }else{
                    messageOfMe.html(convertEmojiMessage);
                    dataToEmit.contactId = targetId;
                }
                //append message to screen
                $(`.right .chat[data-chat=${divId}]`).append(messageOfMe);
                nineScrollRight(divId);

                //remove all data at input
                $(`#write-chat-${divId}`).val("");
                currentEmojioneArea.find(".emojionearea-editor").text("");

                //change message preview and timestamp
                $(`.person[data-chat=${divId}]`).find("span.time").removeClass("message-time-realtime").html(moment(data.message.createdAt).locale("vi").startOf("seconds").fromNow());
                $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(data.message.text));

                //move conversation to top
                $(`.person[data-chat=${divId}]`).on("nhat.moveConversationToTop",function(){
                    let dataToMove = $(this).parent();
                    $(this).closest("ul").prepend(dataToMove);
                    $(this).off("nhat.moveConversationToTop");
                });
        
                $(`.person[data-chat=${divId}]`).trigger("nhat.moveConversationToTop");

                //emit realtime
                socket.emit("chat-text-emoji", dataToEmit);

                //emit remove typing realtime
                typingOff(divId);

                //if typing is in ,remove instanly
                let checkTyping = $(`.chat[data-chat=${divId}]`).find("div.bubble-typing-gif");
                if (checkTyping.length) {
                    checkTyping.remove();
                }
            }).fail(function(response){
                alertify.notify(response.responseText,"error",7);
            });
        }
    });
}

$(document).ready(function(){
    socket.on("response-chat-text-emoji",function(response){
        let divId = "";
        let messageOfYou = $(`<div class="convert-emoji bubble you" data-mess-id="${response.message._id}"></div>`);
        messageOfYou.text(response.message.text);
        let convertEmojiMessage = emojione.toImage(messageOfYou.html());
        if (response.currentGroupId) {
            let username = '<h5>'+response.message.sender.name+'</h5>';
            let senderAvatar = `<img src="/images/users/${response.message.sender.avatar}" class="avatar-small" title="${response.message.sender.name}"/>`;
            messageOfYou.html(`${username} ${senderAvatar} ${convertEmojiMessage}`);

            divId = response.currentGroupId;
            if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
                increaseNumberMessageGroup(divId);
            }
        }else{
            messageOfYou.html(convertEmojiMessage);
            divId = response.currentUserId;
        }

        //append message to screen
        if (response.currentUserId !== $("#dropdown-navbar-user").data("uid")) {
            $(`.right .chat[data-chat=${divId}]`).append(messageOfYou);
            nineScrollRight(divId);
            $(`.person[data-chat=${divId}]`).find("span.time").addClass("message-time-realtime")
        }   

        //change message preview and timestamp
        $(`.person[data-chat=${divId}]`).find("span.time").html(moment(response.message.createdAt).locale("vi").startOf("seconds").fromNow());
        $(`.person[data-chat=${divId}]`).find("span.preview").html(emojione.toImage(response.message.text));

        //move conversation to top
        $(`.person[data-chat=${divId}]`).on("nhat.moveConversationToTop",function(){
            let dataToMove = $(this).parent();
            $(this).closest("ul").prepend(dataToMove);
            $(this).off("nhat.moveConversationToTop");
        });

        $(`.person[data-chat=${divId}]`).trigger("nhat.moveConversationToTop");
    });
});
