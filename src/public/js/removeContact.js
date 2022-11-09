function removeContact(){
    $(".user-remove-contact").unbind("click").on("click",function(){
        let targetId = $(this).data("uid");
        let username = $(this).parent().find("div.user-name p").text();

        Swal.fire({
            title: `Bạn có chắc chắn muốn xóa ${username} khỏi danh bạ ?`,
            text: "Bạn không thể hoàn tác lại quá trình này.",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#2ECC71",
            cancelButtonColor: "#ff7675",
            confirmButtonText: "Xác nhận",
            cancelButtonText: "Hủy"
          }).then((result) => {
            if(!result.value){
                return false;
            }
            $.ajax({
                url:"/contact/remove-contact",
                type: "delete",
                data: {uid: targetId},
                success: function(data){
                    if(data.success){
                        $("#contacts").find(`ul li[data-uid = ${targetId}]`).remove();   
                        decreaseNumberNotiContact("count-contacts");
                        socket.emit("remove-contact",{contactId: targetId});

                        //các bước xử lí sau khi xóa contact
                        //kiểm tra active
                        let checkActive = $("#all-chat").find(`li[data-chat = ${targetId}]`).hasClass("active");
                        //b1: xóa bên leftside.ejs
                        $("#all-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();
                        $("#user-chat").find(`ul a[href = "#uid_${targetId}"]`).remove();

                        //b2: xóa bên rightside.ejs
                        $("#screen-chat").find(`div#to_${targetId}`).remove();
                        
                        //bước 3:xóa imageModel
                        $("body").find(`div#imagesModal_${targetId}`).remove();

                        //bước 4:xóa attachmentModal
                        $("body").find(`div#attachmentsModal_${targetId}`).remove();

                        //bước 5:trả về cuộc trò chuyện đầu
                        if (checkActive) {
                            $("ul.people").find("a")[0].click();
                        }
                    }
                }
            });
          });
    });        
}
socket.on("response-remove-contact",function(user){  
    $("#contacts").find(`ul li[data-uid = ${user.id}]`).remove();   
    decreaseNumberNotiContact("count-contacts");

    //các bước xử lí sau khi xóa contact
    //kiểm tra active
    let checkActive = $("#all-chat").find(`li[data-chat = ${user.id}]`).hasClass("active");
    //b1: xóa bên leftside.ejs
    $("#all-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();
    $("#user-chat").find(`ul a[href = "#uid_${user.id}"]`).remove();

    //b2: xóa bên rightside.ejs
    $("#screen-chat").find(`div#to_${user.id}`).remove();
    
    //bước 3:xóa imageModel
    $("body").find(`div#imagesModal_${user.id}`).remove();

    //bước 4:xóa attachmentModal
    $("body").find(`div#attachmentsModal_${user.id}`).remove();

    //bước 5:trả về cuộc trò chuyện đầu
    if (checkActive) {
        $("ul.people").find("a")[0].click();
    }
});

$(document).ready(function(){
    removeContact();
});
