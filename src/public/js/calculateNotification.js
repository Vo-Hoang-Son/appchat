function increaseNumberNotification(classname,number){
    let currentValue = +$(`.${classname}`).text();
    currentValue += number;

    if (currentValue === 0) {
        $(`.${classname}`).css("display", "none").html("");
    }else{
        $(`.${classname}`).css("display", "block").html(currentValue);
    }
}

function decreaseNumberNotification(classname,number){
    let currentValue = +$(`.${classname}`).text();
    currentValue -= number;

    if (currentValue === 0) {
        $(`.${classname}`).css("display", "none").html("");
    }else{
        $(`.${classname}`).css("display", "block").html(currentValue);
    }
}
