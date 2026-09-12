import { Konami } from "./konami.js";
import { getRandomInt, getRandomFloat, playSound } from "./utils.js";

function setNewRandomizeLolTrigger() {
    randomizeLolTrigger = getRandomInt(3, 9);
}

function throwNewFartElement(innerTxt) {
    let theta = getRandomFloat(0, 360);
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

    // Slightly turn the element on itself from its base rotation angle to another random angle from -50° to +50°
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
let totalSubstancialFarts = 0;
let nextLolTriggerCounter = 0;
let randomizeLolTrigger = 42;
let youShatYourself = false;

const theFartButtonContainerElmt = document.getElementById("button-position");
const theFartButtonElmt = document.getElementById("the-fart-button");
const fartCounterSpan = document.getElementById("total-fart-counter");
const fartLoaderProgressBar = document.getElementById("fart-loader-progress-bar");
const scene = document.getElementById("scene");

fartCounterSpan.innerText = totalFartCount;

setNewRandomizeLolTrigger();


let longMousePress = false;
let currentTimeOut;
let fartOverloadTimeout;
let currentFartValue = 0;

// Handling the event in a separate function to be able to call removeEventListener
theFartButtonElmt.addEventListener("click", clickEventOnFartButtonCallback);

function clickEventOnFartButtonCallback() {
    if(longMousePress) {
        longMousePress = false;
        return;
    }

    let logText = "*prout*";

    if (nextLolTriggerCounter === randomizeLolTrigger) {
        logText = "lol";
        nextLolTriggerCounter = 0;
        setNewRandomizeLolTrigger();
    } else {
        playSound("fart");
        nextLolTriggerCounter++;
        totalFartCount++;
        fartCounterSpan.innerText = totalFartCount;
        localStorage.setItem("totalFartCount", +totalFartCount);
    }

    throwNewFartElement(logText);
}

function handleMouseLongPress() {
    fartLoaderProgressBar.style.top = "100%";
    fartLoaderProgressBar.className = "";

    if (!youShatYourself) {
        let logText = "*prout*";

        if(currentFartValue > 50) {
            totalFartCount += Math.round(currentFartValue);
            fartCounterSpan.innerText = totalFartCount;
            localStorage.setItem("totalFartCount", +totalFartCount);

            if (currentFartValue > 80) {
                // Substancial fart
                totalSubstancialFarts++;
                logText = "*substancial fart*";
                playSound("substancial");

                if (totalSubstancialFarts >= 10) {
                    setTimeout(() => {
                        // police du prout
                        document.body.className = "fart-police";
                        playSound("police");
                        
                        setTimeout(() => {
                            document.body.className = "no-fart-police";
                            gameOverContainer.className = "show";
                            gameOverContainer.getElementsByTagName("h2")[0].innerText = "Too many loud farts. Wasted by the Fart Police."
                            handleClickOnNewGame();
                        }, 3000);
                    }, 2000);
                }
            } else {
                // big fart
                logText = "*big fart*";
                playSound("big");
            }
        } else {
            // normal fart
            if (nextLolTriggerCounter == randomizeLolTrigger) {
                logText = "lol";
                nextLolTriggerCounter = 0;
                setNewRandomizeLolTrigger();
            } else {
                playSound("fart");
                nextLolTriggerCounter++;
                totalFartCount++;
                fartCounterSpan.innerText = totalFartCount;
                localStorage.setItem("totalFartCount", +totalFartCount);
            }
        }

        throwNewFartElement(logText);

        currentFartValue = 0;
    }
}

theFartButtonElmt.addEventListener("mousedown", () => {
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
        handleMouseLongPress();
    }
});

theFartButtonElmt.addEventListener("mouseup", () => {
    clearTimeout(currentTimeOut);
    clearTimeout(fartOverloadTimeout);

    if (longMousePress) {
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
            youShatYourself = true;
            playSound("diarrhea");

            const poopElement = document.createElement("div");
            poopElement.className = "poop";
            poopElement.innerHTML = `
                <div class="poop-layer layer-1"></div>
                <div class="poop-layer layer-2"></div>
                <div class="poop-layer layer-3"></div>
                <div class="poop-layer layer-4"></div>`;

            scene.appendChild(poopElement);

            let listPoop = document.getElementsByClassName("poop-layer");

            setTimeout(() => {
                for (let i = 0; i < listPoop.length; i++) {
                    let currentPoopLayer = listPoop[i];

                    currentPoopLayer.addEventListener("click", handleClickOnTheShit, false);
                }
            }, 0);

            setTimeout(() => {
                setTimeout(() => {
                    scene.removeChild(poopElement);
                    youShatYourself = false;
                }, 400);
                 
                gameOverContainer.className = "show";
                gameOverContainer.getElementsByTagName("h2")[0].innerText = "Fart overload, you shat yourself."
                handleClickOnNewGame();
            }, 30000);
        }, 400);
    } else {
        currentTimeOut = setTimeout(() => {
            mouseDownHandler(currentValue);
        }, 10)
    }

    fartLoaderProgressBar.style.top = 100 - currentFartValue + "%";
}

function handleClickOnTheShit(evt) {
    evt.stopPropagation();
    console.log(evt, evt.target);
    let cx = evt.clientX;
    let cy = evt.clientY;

    let dot = document.createElement("div");
    dot.className = "red-dot";
    dot.style = `
    z-index: 300;
        border-radius: 50px;
            width: 50px; 
            height: 50px; 
            background-color: red; 
            position:absolute;
            top:${cy}px;
            left:${cx}px;
            transform: translate(-50%, -50%)`;
    document.body.appendChild(dot);
    dot.addEventListener("click", handleClickOnTheShit, false);
}

// Konami Code
const rickElement = document.getElementById('rick');
const konamiHandler = new Konami(() => {
    konamiHandler.unload();
    console.log('Konami thrown and unloaded');
    rickElement.className = "show";
    playSound("rick");
    setTimeout(() => {
        konamiHandler.load()
        rickElement.className = "hide";

        gameOverContainer.className = "show";
        gameOverContainer.getElementsByTagName("h2")[0].innerText = "You've been RickRolled."
        handleClickOnNewGame();
    }, 22000);
})

const gameOverContainer = document.getElementById("game-over");
// Handling click on any new game button
const newGameButtonList = document.getElementsByClassName("new-game-button");
// @TODO this method shall not allow the garbage collector to destroy a new-game-button element when removed from the DOM
// --> should remove the event handler at some point
function handleClickOnNewGame() {
    for (const newGameButton of newGameButtonList) {
        newGameButton.addEventListener('click', (evt) => {
            evt.stopPropagation();
            console.log("New game bro", evt.target);
            gameOverContainer.className = "hide";
        })
    }
}
