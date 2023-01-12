import {
  hasClass,
  getRandomItems,
  removeElements,
  stopClicks,
  checkTimer,
  startCountDown
} from "./helpers.js";

export const whackGame = (elementToAppend, elementTwoToAppend) => {
  const countDownStart = 40
  let secondsTimer = countDownStart
  let score = 0
  let isGameOver = false
  let timerIsActive = false
  let interval

  const checkGameOver = () => {
    score === numCards * 10 ? isGameOver = true : isGameOver = false
    
    return isGameOver
  }

  const restartGame = () => {
    console.log("RESTARTING GAME...")
    removeElements(gameSpace$$, "div")
    secondsTimer = countDownStart
    timerSeconds$$.textContent = countDownStart
    score = 0
    scoreNumber$$.textContent = 0
  }

  const printWhackBlocks = (pokemon) => {
    for (let i = 0; i < 6; i++) {

      const block$$ = document.createElement("div");
      block$$.className = "block";
      block$$.innerHTML = `
      <div class="block-whack id-${i}">
        <div class="whack-pokemon">
          <img id="pokemon${i}" src="${pokemon}" class="whack-pokemon__img">
        </div>
        <div class="whack-dirt">
          <img src="./assets/dirt.png" class="whack-dirt__img">
        </div>
      </div>
      `;

      gameSpace$$.appendChild(block$$)
    }

  }

  // function startGame() {
  //   scoreBoard.textContent = 0;
  //   timeUp = false;
  //   score = 0;
  //   peep();
  //   setTimeout(() => timeUp = true, 15000) 
  //muestra topos aleatoriamente durante 15 segundos
  // }







  //! PRINTING ELEMENTS ON SCREENS-----------------------------------------

  //*print screen 1 -> GAME -----------------------------------------------
  const miniGame$$ = document.createElement("div");
  miniGame$$.className = "miniGame-whack";
  elementToAppend.appendChild(miniGame$$);

  const h2$$ = document.createElement("h2");
  h2$$.textContent = "WHACK A DIGLETT";
  miniGame$$.appendChild(h2$$);
  const gameSpace$$ = document.createElement("div");
  gameSpace$$.className = "game-space"
  miniGame$$.appendChild(gameSpace$$)

  //* Print screen 2 -> DETAILS -----------------------------------------------
  const gameDetails$$ = document.createElement("div");
  gameDetails$$.className = "miniGame-details"
  gameDetails$$.innerHTML = `
    <h1>-GUACAMOLE-</h1>
    <div class="timer">
      <h2>TIMER</h2>
      <p class="timer-seconds">${countDownStart}</p>
      <button class="start__btn">RESTART</button>
      <button class="restart__btn">START</button>
    </div>
    <div class="score">
      <h2>SCORE</h2>
      <p class="score-number">000</p>
    </div> `;

  elementTwoToAppend.appendChild(gameDetails$$)
  const startBtn$$ = document.querySelector(".start__btn")
  const restartBtn$$ = document.querySelector(".restart__btn")
  startBtn$$.addEventListener("click", () => {
    startCountDown()
  })
  restartBtn$$.addEventListener("click", () => {
    clearInterval(interval)    
    restartGame()
  })
  const scoreNumber$$ = document.querySelector(".score-number")
  const timerSeconds$$ = document.querySelector(".timer-seconds")

  printWhackBlocks("./assets/diglett.png")
}
 