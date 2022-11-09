function readMoreMessages(){
    $(".right .chat").unbind("scroll").on("scroll",function(){
        //lấy tin nhắn đầu tiên
        let firstMessage = $(this).find(".bubble:first");
        //lấy vị trí của tin nhắn đầu tiên
        let currentOffSet = firstMessage.offset().top - $(this).scrollTop();

        if ($(this).scrollTop() === 0) {
            let messageLoading = `<img src="images/chat/message-loading.gif" class="message-loading" />`;
            $(this).prepend(messageLoading);

            let targetId = $(this).data("chat");
            let skipMessage = $(this).find("div.bubble").length;
            let chatInGroup = $(this).hasClass("chat-in-group") ? true : false; 
            let scrollDom = $(this);

            $.get(`/message/read-more?skipMessage=${skipMessage}&targetId=${targetId}&chatInGroup=${chatInGroup}`,function(data){
                if (data.rightSideData.trim() === "") {
                    alertify.notify("Bạn không còn tin nhắn nào trong cuộc trò chuyện này nữa","error",7);
                    scrollDom.find("img.message-loading").remove();
                    return false;
                }   
                //bước 1: xử lí rightSide
                $(`.right .chat[data-chat=${targetId}]`).prepend(data.rightSideData);
                //bước 2:chặn scroll
                $(`.right .chat[data-chat=${targetId}]`).scrollTop(firstMessage.offset().top - currentOffSet);

                //bước 3: convert emoji
                convertEmoji();

                //bước 4: 
                $(`#imagesModal_${targetId}`).find("div.all-images").append(data.imageModalData);

                //bước 5 : gọi gridPhotos
                gridPhotos(5);

                //bước 6: xử lí attachmentModal
                $(`attachmentsModal_${targetId}`).find("ul.list-attachments").append(data.attachmentModalData);

                //bước 7:xóa message loading
                scrollDom.find("img.message-loading").remove();

            });
        }
    });
};

$(document).ready(function(){
    readMoreMessages();
});
