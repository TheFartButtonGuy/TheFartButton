"use strict";

function getRandomInt(min, max) {
    min = min || 0;
    max = max || min + 1;
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setNewRandomizeLolTrigger() {
    randomizeLolTrigger = getRandomInt(3, 9);
}

function throwNewFartElement(innerTxt) {

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

let totalFartCount = 0;
let nextLolTriggerCounter = 0;
let randomizeLolTrigger = 42;

const theFartButtonContainerElmt = document.getElementById("button-position");
const theFartButtonElmt = document.getElementById("the-fart-button");
const fartCounterSpan = document.getElementById('total-fart-counter');

setNewRandomizeLolTrigger();

theFartButtonElmt.addEventListener("click", () => {
    let logText = "*prout*";

    if (nextLolTriggerCounter == randomizeLolTrigger) {
        logText = "lol";
        nextLolTriggerCounter = 0;
        setNewRandomizeLolTrigger();
    } else {
        nextLolTriggerCounter++;
        totalFartCount++;
        fartCounterSpan.innerText = totalFartCount;
    }

    throwNewFartElement(logText);
})
