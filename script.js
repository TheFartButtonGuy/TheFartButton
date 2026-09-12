"use strict";

function getRandomInt(min, max) {
    min = min || 0;
    max = max || min + 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setNewRandomizeLolTrigger() {
    randomizeLolTrigger = getRandomInt(3, 9);
}

// TODO change function name "throw" -> "launch" (throw is for error)
function throwNewAudioElement(type = "fart") {
    let newAudioElmt = document.createElement("audio");

    // TODO use switch statement
    if (type == "fart") {
        let fartNumber = getRandomInt(1, 19);
        newAudioElmt.setAttribute("src", `./sounds/fart${fartNumber}.mp3`);
    } else if (type == "diarrhea") {
        let fartNumber = getRandomInt(1, 2) == 1 ? 1 : 3;
        newAudioElmt.setAttribute("src", `./sounds/explosive_diarrhea${fartNumber}.mp3`);
    } else if (type == "big") {
        let fartNumber = getRandomInt(1, 6);
        newAudioElmt.setAttribute("src", `./sounds/big_fart${fartNumber}.mp3`);
    } else if (type == "substancial") {
        let fartNumber = getRandomInt(1, 3);
        newAudioElmt.setAttribute("src", `./sounds/substancial_fart${fartNumber}.mp3`);
    } else if (type == "rick") {
        newAudioElmt.setAttribute("src", "./sounds/rickroll.mp3");
    }

    // Automatically remove the audio element when it has fully played
    newAudioElmt.addEventListener("ended", () => {
        document.body.removeChild(newAudioElmt);
    });

    document.body.appendChild(newAudioElmt);
    newAudioElmt.play();
}

function throwNewFartElement(innerTxt) {
    console.log("throw new fart element with innertxt:", innerTxt);

    let theta = getRandomInt(0,360);
    let thetaRadiant = theta * Math.PI/180; // Math.sin and Math.cos expect radiant, not degrees
    let radius = getRandomInt(300, 500);
    let thetaEnd = theta + getRandomInt(-50, 50);

    let xPosition = radius * Math.sin(thetaRadiant);
    let yPosition = -(radius * Math.cos(thetaRadiant)); // positive yPosition from Math.cos is at the top

    const animation = [
        {
            left: "50%", 
            top: "50%"
        },
        {
            left: "calc(50% + " + xPosition + "px)",
            top: "calc(50% + " + yPosition + "px)"
        }
    ];

    const animTwo = [
        {
            transform: "translateX(-50%) translateY(-50%) rotate(" + theta + "deg)"
        },
        {
            transform: "translateX(-50%) translateY(-50%) rotate(" + thetaEnd + "deg)"
        }
    ]

    const animOptions = {
        duration: 1000,
        easing: "cubic-bezier(0, 1.086, 0.679, 0.995)",
        fill: "forwards"
    }
    const animOptionsTwo = {
        duration: 1000,
        easing: "ease-in",
        fill: "forwards"
    }

    let newDiv = document.createElement("div");
    newDiv.className = "fart-element";
    newDiv.style.transform = "translateX(-50%) translateY(-50%) rotate(" + theta + "deg)";

    // TODO use === instead of ==
    if(innerTxt == "lol") {
        newDiv.style.fontSize = "2.2em";
        newDiv.style.color = "black";
    }

    newDiv.innerText = innerTxt;

    newDiv.animate(animation, animOptions);
    newDiv.animate(animTwo, animOptionsTwo);

    theFartButtonContainerElmt.appendChild(newDiv);

    window.setTimeout(() => {
        theFartButtonContainerElmt.removeChild(newDiv)
    }, 1000);
}

let totalFartCount = +localStorage.getItem("totalFartCount") || 0;
let nextLolTriggerCounter = 0;
let randomizeLolTrigger = 42;

const theFartButtonContainerElmt = document.getElementById("button-position");
const theFartButtonElmt = document.getElementById("the-fart-button");
const fartCounterSpan = document.getElementById("total-fart-counter");
const expValueSpan = document.getElementById("exp-value-container");
const fartLoaderProgressBar = document.getElementById("fart-loader-progress-bar");
const scene = document.getElementById("scene");

fartCounterSpan.innerText = totalFartCount;

setNewRandomizeLolTrigger();


let longMousePress = false;
let cancelClickEvent = false;
let currentTimeOut;
let fartOverloadTimeout;
let currentFartValue = 0;

function handleClickEventOnFartButton() {
    console.log("Click event is now handle");
    theFartButtonElmt.addEventListener("click", clickEventOnFartButtonCallback);
}

function clickEventOnFartButtonCallback() {
    console.log("Click event! Will handle? ", !longMousePress);
    if(longMousePress) {
        longMousePress = false;
        return;
    } 

    let logText = "*prout*";

    if (nextLolTriggerCounter == randomizeLolTrigger) {
        logText = "lol";
        nextLolTriggerCounter = 0;
        setNewRandomizeLolTrigger();
    } else {
        throwNewAudioElement();
        nextLolTriggerCounter++;
        totalFartCount++;
        fartCounterSpan.innerText = totalFartCount;
        localStorage.setItem("totalFartCount", +totalFartCount);
    }

    throwNewFartElement(logText);
}

handleClickEventOnFartButton();

function handleMouseLongPress() {
    console.log("handleMouseLongPress", currentFartValue);
    fartLoaderProgressBar.style.top = "100%";
    fartLoaderProgressBar.className = "";

    let logText = "*prout*";

    if(currentFartValue > 50) {
        console.log("currentFartValue > 50");

        totalFartCount += Math.round(currentFartValue);
        fartCounterSpan.innerText = totalFartCount;
        localStorage.setItem("totalFartCount", +totalFartCount);

        if (currentFartValue > 80) {
            // Substancial fart
            console.log("currentFartValue > 80, go for substancial");
            logText = "*substancial fart*";
            throwNewAudioElement("substancial");
        } else {
            console.log("Should be a big fart");
            // big fart
            logText = "*big fart*";
            throwNewAudioElement("big");
        }
    } else {

        // normal fart
        if (nextLolTriggerCounter == randomizeLolTrigger) {
            logText = "lol";
            nextLolTriggerCounter = 0;
            setNewRandomizeLolTrigger();
        } else {
            throwNewAudioElement();
            nextLolTriggerCounter++;
            totalFartCount++;
            fartCounterSpan.innerText = totalFartCount;
            localStorage.setItem("totalFartCount", +totalFartCount);
        }
    }

    console.log("Logtext there bro:", logText);
    throwNewFartElement(logText);

    currentFartValue = 0;
}

theFartButtonElmt.addEventListener("mousedown", () => {
    console.log("Mouse down event");

    // Wait 400ms before considering the mousedown
    currentTimeOut = setTimeout(() => {
        longMousePress = true;
        mouseDownHandler();
    }, 400);
});

theFartButtonElmt.addEventListener("mouseleave", () => {
    clearTimeout(currentTimeOut);
    clearTimeout(fartOverloadTimeout);

    if (longMousePress) {
        longMousePress = false;
        console.log("mouseleave");
        handleMouseLongPress();
    }
});

theFartButtonElmt.addEventListener("mouseup", () => {
    clearTimeout(currentTimeOut);
    clearTimeout(fartOverloadTimeout);

    if (longMousePress) {
        console.log("mouseup");
        setTimeout(handleMouseLongPress, 0)
    }
});

function mouseDownHandler(currentValue = 0) {
    currentFartValue = Math.round(Math.exp(++currentValue / 30) * 100) / 100;
    let fartOverload = false;

    if(currentFartValue >= 80) {
        fartOverload = true;
        fartLoaderProgressBar.className = "fart-overloading";
    }

    if (currentFartValue >= 100) {
        currentFartValue = 100;
        clearTimeout(currentTimeOut);

        fartOverloadTimeout = setTimeout(() => {
            throwNewAudioElement("diarrhea");
            scene.innerHTML = `<div class="poop">

                <div class="poop-layer layer-1"></div>
                <div class="poop-layer layer-2"></div>
                <div class="poop-layer layer-3"></div>
                <div class="poop-layer layer-4"></div>

            </div>`;

            let listPoop = document.getElementsByClassName("poop-layer");

            setTimeout(() => {
                for (let i = 0; i < listPoop.length; i++) {
                    let currentPoopLayer = listPoop[i];
                    console.log(`Poop ${i}`, currentPoopLayer);

                    currentPoopLayer.addEventListener("click", (evt) => {
                        evt.stopPropagation();
                        console.log(evt.target);
                    }, false);
                }
            }, 0);
        }, 500)
    } else {
        currentTimeOut = setTimeout(() => {
            mouseDownHandler(currentValue);
        }, 10)
    }

    expValueSpan.innerText = currentFartValue;
    fartLoaderProgressBar.style.top = 100 - currentFartValue + "%";
}

// Konami Code
const rickElement = document.getElementById('rick');
const konamiHandler = new Konami(() => {
    konamiHandler.unload();
    console.log('Konami thrown and unloaded');
    rickElement.className = "show";
    throwNewAudioElement("rick");
    setTimeout(() => {
        konamiHandler.load()
        rickElement.className = "hide";
        console.log('Konami reloaded');
    }, 22000);
})
