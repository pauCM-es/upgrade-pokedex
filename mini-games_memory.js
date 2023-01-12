import {
  hasClass,
  getRandomItems,
  shuffle,
  removeElements
} from "./helpers.js";

export const memoryGame = (elementToAppend, elementTwoToAppend, list) => {
  
  const numCards = 18 //this is the important variable
  let pairOfCards = []
  const countDownStart = 40
  let secondsTimer = countDownStart
  let score = 0
  let isGameOver = false
  let timerIsActive = false
  let cardsShuffled = []
  const numImgs = numCards / 2
  let interval
  
  //! LOGIC ---------------------------------------------------------------
  //get random items from a list and shuffle before displaying them
  const prepareCards = () => {
    const randomItemsIds = getRandomItems(numImgs, list, "id")
    const cards = [...randomItemsIds, ...randomItemsIds]
    const cardsShuffled = shuffle(cards)
    console.log(cardsShuffled)
    return cardsShuffled
  }

  const printCards = (cardsList) => {
    cardsList.forEach(card => {
      const pokemon = list.filter(pkm => pkm.id === card)
      const cardBlock$$ = document.createElement("div");
      cardBlock$$.className = "block";
      cardBlock$$.innerHTML = `
      <div class="card id-${card}">
        <div class="card__face card__face--back">
          <img src="./assets/pokeball.svg" class="${card}">
          </div>
          <div class="card__face card__face--front">
          <img src="${pokemon[0].sprites.front_default}">
        </div>
      </div>
      `;

      cardsSpace$$.appendChild(cardBlock$$)
    })

    const cardsBacks$$ = document.querySelectorAll(".card__face--back")
    cardsBacks$$.forEach(element => {
      element.addEventListener("click", (e) => { logic(e)})
    })
  }
  
  const stopClicks = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };


  const checkTimer = (numero) => {
    if (numero === 0) {
      isGameOver = true
      timerIsActive = false
      return true
    }
  }

  const startCountDown = (seconds) => {
    interval = setInterval(() => {
      console.log(seconds);
      seconds--;
      timerSeconds$$.textContent = seconds
      checkTimer(seconds) && clearInterval(interval)
  }, 1000);
  }

  const checkGameOver = () => {
    score === numCards * 10 ? isGameOver = true : isGameOver = false
    
    return isGameOver
  }

  const flipCard = (e) => {
    const elementToFlipped = e.composedPath()[2]

    //Count down turns on
    !timerIsActive ? timerIsActive = true : timerIsActive

    //if not guessed -> flip it
    if (!hasClass(elementToFlipped, "is-guessed")) {
      pairOfCards.length < 2 && pairOfCards.push(e.target.classList.value)
      elementToFlipped.classList.add("is-flipped")

      //remove for "X"ms clicks on page
      document.addEventListener("click", stopClicks, true);
      setTimeout(() => {
        document.removeEventListener("click", stopClicks, true);
      }, 700);
    }
    
  }

  const compareCards = (e) => {
    // if images ===, identify as guessed, add to score, check for gameOver.
    if (pairOfCards[0] === pairOfCards[1]) {
      const guessedCards = document.querySelectorAll(`.id-${pairOfCards[0]}`)
      guessedCards.forEach(card => {
        card.classList.add("is-guessed")
      })

      score += 20 //10pts each card
      scoreNumber$$.textContent = score
      checkGameOver()
      return true

    } else {return false}
  }

  const flipBack = (e) => {
    //of fipped cards, check if guessed, and if not, flip back.
    const cardsToFlip = document.querySelectorAll(".is-flipped")
    cardsToFlip.forEach(card => {
      if(!hasClass(card, "is-guessed")) {
        card.classList.toggle("is-flipped")
      }
    })

    pairOfCards = []
  }

  const restartGame = () => {
    console.log("RESTARTING GAME...")
    removeElements(cardsSpace$$, "div")
    secondsTimer = countDownStart
    timerSeconds$$.textContent = countDownStart
    score = 0
    scoreNumber$$.textContent = 0
    pairOfCards = []
    isGameOver = false
    cardsShuffled = prepareCards()
    printCards(cardsShuffled)
  }

  const logic = (e) => {
    !isGameOver && !timerIsActive && startCountDown(secondsTimer)
    !isGameOver && flipCard(e)
    pairOfCards.length === 2 && compareCards()
    pairOfCards.length === 2 && setTimeout(() => {flipBack()}, 700)
  }


  //! PRINTING ELEMENTS ON SCREENS-----------------------------------------

  //*print screen 1 -> GAME -----------------------------------------------
  const miniGame$$ = document.createElement("div");
  miniGame$$.className = "miniGame-memory";
  elementToAppend.appendChild(miniGame$$);

  const h2$$ = document.createElement("h2");
  h2$$.textContent = "MEMORY GAME";
  miniGame$$.appendChild(h2$$);
  const cardsSpace$$ = document.createElement("div");
  cardsSpace$$.className = "cards-space"
  miniGame$$.appendChild(cardsSpace$$)

  //* Print screen 2 -> DETAILS -----------------------------------------------
  const gameDetails$$ = document.createElement("div");
  gameDetails$$.className = "miniGame-details"
  gameDetails$$.innerHTML = `
    <h1>-MEMORY GAME-</h1>
    <div class="timer">
      <h2>TIMER</h2>
      <p class="timer-seconds">${countDownStart}</p>
      <button class="restart__btn">RESTART</button>
    </div>
    <div class="score">
      <h2>SCORE</h2>
      <p class="score-number">000</p>
    </div> `;

  elementTwoToAppend.appendChild(gameDetails$$)
  const restartBtn$$ = document.querySelector(".restart__btn")
  restartBtn$$.addEventListener("click", () => {
    clearInterval(interval)    
    restartGame()
  })
  const scoreNumber$$ = document.querySelector(".score-number")
  const timerSeconds$$ = document.querySelector(".timer-seconds")


  //! BARAJAMOS Y REPARTIMOS EN CARTAS -----------------------------------------
  cardsShuffled = prepareCards()
  printCards(cardsShuffled)

}
