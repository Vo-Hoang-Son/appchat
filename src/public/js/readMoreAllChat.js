$(document).ready(function(){
    $('#link-read-more-all-chat').bind("click",function(){
       let skipPersonal = $("#all-chat").find("li:not(.group-chat)").length;
       let skipGroup = $("#all-chat").find("li.group-chat").length;


        $("#link-read-more-all-chat").css("display", "none");
        $(".read-more-all-chat-loader").css("display", "inline-block");

        $.get(`/message/read-more-all-chat?skipPersonal=${skipPersonal} &skipGroup=${skipGroup}`,function(data){
            if (data.leftSideData.trim() === "") {
                alertify.notify("Bạn không còn cuộc trò chuyện nào để xem nữa","error",7);
                $("#link-read-more-all-chat").css("display", "inline-block");
                $(".read-more-all-chat-loader").css("display", "none");
                return false;
            }         
            //bước 1:xử lí leftSide
            $("#all-chat").find("ul").append(data.leftSideData);
            //bước 2:xử lí scroll
            resizeNineScrollLeft();
            nineScrollLeft();
            //bước 3:xử lí rightSide
            $("#screen-chat").append(data.rightSideData);
            //bước 4: gọi function screnn-chat
            changeScreenChat();
            //bước 5: convert emoji
            convertEmoji();

            //bước 6: xử lí imageModal
            $("body").append(data.imageModalData);

            //bước 7 : gọi gridPhotos
            gridPhotos(5);

            //bước 8:xử lí attachmentModal
            $("body").append(data.attachmentModalData);

            //bước 9 : kiểm tra online
            socket.emit("check-status");

            $("#link-read-more-all-chat").css("display", "inline-block");
            $(".read-more-all-chat-loader").css("display", "none");

            readMoreMessages();
        });     
    });
    
});
