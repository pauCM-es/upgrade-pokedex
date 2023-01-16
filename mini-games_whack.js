import {
  hasClass,
  getRandomItems,
  removeElements,
  stopClicks,
  checkTimer,
  startCountDown,
  getElement,
  randomNumber,
  toggleClasses,
} from "./helpers.js";

export const whackGame = (elementToAppend, elementTwoToAppend) => {
  const countDownStart = 20
  let score = 0
  let timeUp = false
  let lastHole = 0
  let interval = 800
  let timer
  const molesImg = [
    {name: "diglett", possibility: 50},
    {name: "dugtrio", possibility: 80},
    {name: "guacamole", possibility: 100}
  ]

  const startGame = () => {
    console.log("START GAME")
    scoreNumber$$.textContent = 0;
    timeUp = false;
    score = 0;
    game(interval);
    setTimeout(() => {
      timeUp = true
    }, countDownStart * 1000) 
  }

  const randomHole = (min, max) => {
    let newRandomHole = randomNumber(min, max)
    while ( newRandomHole === lastHole) {
      newRandomHole = randomNumber(min, max)
    }
    lastHole = newRandomHole
    return newRandomHole
  }

  const peep = (miliseconds, element) => {
    const possibility = randomNumber(1,100)
    const randomImg = molesImg.find(mole => mole.possibility > possibility)
    const elementChild = element.firstChild.nextSibling
    element.classList.add("up")
    toggleClasses(elementChild, ["diglett", randomImg.name])
    setTimeout(() => {
      element.classList.remove("up")
      toggleClasses(elementChild, ["diglett", randomImg.name])
    }, miliseconds);
  }

  const whack = (e) => {
    console.log("WHACK")
    // console.log(e.composedPath())
    console.log(e.target)
    // e.target.classList.remove("up")
    // if (condition) {
      
    // }
    // scoreNumber$$.textContent = score
    // console.log(score)
  }

  const game = (time) => {


    setInterval(() => {
      if (!timeUp) {
        const hole$$ = document.getElementById(randomHole(1,6))
        const moleTime = randomNumber(1000, 1000)
        peep(moleTime, hole$$)
      }
    }, time);
  }

  //! PRINTING ELEMENTS ON SCREENS-----------------------------------------

  //*print screen 1 -> GAME -----------------------------------------------
  const miniGame$$ = document.createElement("div");
  miniGame$$.className = "miniGame-whack";

  const gameSpace$$ = document.createElement("div");
  gameSpace$$.className = "game-space"
  gameSpace$$.innerHTML = 
  `
  <div id="1" class="hole hole1">
    <div class="mole diglett"></div>
  </div>
  
  <div id="2"  class="hole hole2">
    <div class="mole diglett"></div>
  </div>
  
  <div id="3"  class="hole hole3">
    <div class="mole diglett"></div>
  </div>
  
  <div id="4"  class="hole hole4">
    <div class="mole diglett"></div>
  </div>
  
  <div id="5"  class="hole hole5">
    <div class="mole diglett"></div>
  </div>
  
  <div id="6"  class="hole hole6">
    <div class="mole diglett"></div>
  </div>`

  miniGame$$.appendChild(gameSpace$$)
  elementToAppend.appendChild(miniGame$$);
        
  //* Print screen 2 -> DETAILS -----------------------------------------------
  const gameDetails$$ = document.createElement("div");
  gameDetails$$.className = "miniGame-details"
  gameDetails$$.innerHTML = `
    <h1>-GUACAMOLE-</h1>
    <div class="timer">
      <h2>TIMER</h2>
      <p class="timer-seconds">${countDownStart}</p>
      <button class="start__btn">START</button>
    </div>
    <div class="score">
      <h2>SCORE</h2>
      <p class="score-number">000</p>
    </div> `;

  elementTwoToAppend.appendChild(gameDetails$$)
  const startBtn$$ = document.querySelector(".start__btn")
  startBtn$$.addEventListener("click", () => {
    startGame()
  })
  const scoreNumber$$ = document.querySelector(".score-number")
  const timerSeconds$$ = document.querySelector(".timer-seconds")

  const moles$$ = document.querySelectorAll(".mole")
  const holes$$ = document.querySelectorAll(".hole")
  // for (const mole of moles$$) {
  //   mole.addEventListener("click", (event) => {
  //     console.log("clickkkkkkkkkk", event.composedPath())
  //     // whack(e)
  //   })
  // }
  for (const hole of holes$$) {
    hole.addEventListener("click", (e) => {
      whack(e)
    })
  }
}
 