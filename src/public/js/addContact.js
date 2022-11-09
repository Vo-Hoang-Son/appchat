function addContact(){
    $(".user-add-new-contact").bind("click",function(){
        let targerId = $(this).data("uid");
        console.log(targerId);
        $.post("/contact/add-new", {uid: targerId},function(data){
            if(data.success){
                $("#find-user").find(`div.user-add-new-contact[data-uid = ${targerId}]`).hide();
                $("#find-user").find(`div.user-remove-request-contact-sent[data-uid = ${targerId}]`).css("display", "inline-block");
                increaseNumberNotification("noti_contact_counter",1);

                increaseNumberNotiContact("count-request-contact-sent");

                let userInfoHtml = $("#find-user").find(`ul li[data-uid= ${targerId}]`).get(0).outerHTML;
                $("#request-contact-sent").find("ul").prepend(userInfoHtml);

                removeRequestContactSent(); //js/removerequestcontactsent.js

                socket.emit("add-new-contact",{contactId: targerId});
            }
        });
    });        
}

socket.on("response-add-new-contact",function(user){
    let notif = `<div class="notif-readed-false" data-uid="${user.id}">
                <img class="avatar-small" src="images/users/${user.avatar}" alt=""> 
                <strong>${user.username}</strong> đã gửi cho bạn một lời mời kết bạn!
                </div>`;
    $(".noti_content").prepend(notif); //popup notifi 
    $("ul.list-notifications").prepend(`<li>${notif}</li>`); //modal notifi
    increaseNumberNotiContact("count-request-contact-received");    
    
    increaseNumberNotification("noti_contact_counter",1);
    increaseNumberNotification("noti_counter",1);

    let userInfoHtml = `<li class="_contactList" data-uid="${user.id}">
                            <div class="contactPanel">
                                <div class="user-avatar">
                                    <img src="images/users/${user.avatar}" alt="">
                                </div>
                                <div class="user-name">
                                    <p>
                                    ${user.username}
                                    </p>
                                </div>
                                <br>
                                <div class="user-address">
                                    <span>&nbsp ${user.address}</span>
                                </div>
                                <div class="user-approve-request-contact-received" data-uid="${user.id}">
                                    Chấp nhận
                                </div>
                                <div class="user-remove-request-contact-received action-danger" data-uid="${user.id}">
                                    Xóa yêu cầu
                                </div>
                            </div>
                        </li>`;
    $("#request-contact-received").find("ul").prepend(userInfoHtml);    
    
    removeRequestContactReceived();//js/removeRequestContactReceived.js
    approveRequestContactReceived();
});
