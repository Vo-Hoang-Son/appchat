function increaseNumberMessageGroup(divid){
    let currentValue = +$(`.right[data-chat=${divid}]`).find("span.show-number-messages").text();
    currentValue += 1;

    $(`.right[data-chat=${divid}]`).find("span.show-number-messages").html(currentValue);
}
