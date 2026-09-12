export function getRandomInt(min = 0, max = min + 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomFloat(min = 0, max = min + 1, precision = 2) {
    precision = precision > 20 ? 20 : precision; // Too many digits in .toFixed method can lead to problems
    return +(Math.random() * (max - min + 1) + min).toFixed(precision); // "+" to cast to Number cause .toFixed returns a string
}

export function playSound(type = "fart") {
    let newAudioElmt = document.createElement("audio");
    let srcAttrValue = "";

    switch(type) {
        case "fart": 
            srcAttrValue = `./sounds/fart${getRandomInt(1, 19)}.mp3`;
            break;
        case "diarrhea": 
            srcAttrValue = `./sounds/explosive_diarrhea${getRandomInt(1, 2) == 1 ? 1 : 3}.mp3`;
            break;
        case "big": 
            srcAttrValue = `./sounds/big_fart${getRandomInt(1, 6)}.mp3`;
            break;
        case "substancial": 
            srcAttrValue = `./sounds/substancial_fart${getRandomInt(1, 3)}.mp3`;
            break;
        case "rick":
            srcAttrValue = "./sounds/rickroll.mp3";
            break;
        case "police":
            srcAttrValue = "./sounds/fart_police.mp3";
            break;
    }

    newAudioElmt.setAttribute("src", srcAttrValue);

    // Automatically remove the audio element when it has fully played
    newAudioElmt.addEventListener("ended", () => {
        document.body.removeChild(newAudioElmt);
    });

    document.body.appendChild(newAudioElmt);
    newAudioElmt.play();
}