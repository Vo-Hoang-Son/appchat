function increaseNumberNotiContact(classname){
    let currentValue = +$(`.${classname}`).find("em").text();
    currentValue += 1;

    if (currentValue === 0) {
        $(`.${classname}`).html("");
    }else{
        $(`.${classname}`).html(`(<em>${currentValue}</em>)`);
    }
}

function decreaseNumberNotiContact(classname){
    let currentValue = +$(`.${classname}`).find("em").text();
    currentValue -= 1;

    if (currentValue === 0) {
        $(`.${classname}`).html("");
    }else{
        $(`.${classname}`).html(`(<em>${currentValue}</em>)`);
    }
}
