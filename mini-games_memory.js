import {
  hasClass,
  getRandomItems,
  shuffle
} from "./helpers.js";

export const memoryGame = (elementToAppend, elementTwoToAppend, list) => {
  
  const numCards = 18 //this is the important variable
  let pairOfCards = []
  const countDownStart = 10
  let secondsTimer = 5
  let score = 0
  let isGameOver = false
  let cardsShuffled = []

  const numImgs = numCards / 2
  
  //*get random items from a list and shuffled them before displaying them
  const prepareCards = () => {
    const randomItemsIds = getRandomItems(numImgs, list, "id")
    const cards = [...randomItemsIds, ...randomItemsIds]
    const cardsShuffled = shuffle(cards)
    console.log(cardsShuffled)
    return cardsShuffled
  }
  cardsShuffled = prepareCards()

  //*print screen 1 - GAME
  console.log("printing mini game memory");
  const miniGame$$ = document.createElement("div");
  miniGame$$.className = "miniGame-memory";
  elementToAppend.appendChild(miniGame$$);
  const h2$$ = document.createElement("h2");
  h2$$.textContent = "MEMORY GAME";
  miniGame$$.appendChild(h2$$);
  const cardsSpace$$ = document.createElement("div");
  cardsSpace$$.className = "cards-space"
  miniGame$$.appendChild(cardsSpace$$)

  //*print cards
  const printCards = (cardsList) => {
    cardsList.forEach(card => {
      const pokemon = list.filter(pkm => pkm.id === card)
      const cardBlock$$ = document.createElement("div");
      const card$$ = document.createElement("div");
      const cardFront$$ = document.createElement("div");
      const cardBack$$ = document.createElement("div");
      const imgFront$$ = document.createElement("img")
      const imgBack$$ = document.createElement("img")
      cardBlock$$.className = "block";
      card$$.className = `card id-${card}`;
      cardFront$$.className = "card__face card__face--front";
      cardBack$$.className = "card__face card__face--back";
      imgFront$$.src = pokemon[0].sprites.front_default
      imgBack$$.src = "./assets/pokeball.svg"
      imgBack$$.className = card
      cardFront$$.appendChild(imgFront$$)
      cardBack$$.appendChild(imgBack$$)
      card$$.append(cardBack$$, cardFront$$);
      cardBlock$$.appendChild(card$$)
      cardsSpace$$.appendChild(cardBlock$$)
  
      cardBack$$.addEventListener("click", (e) => { logic(e)})
    })
  }
  printCards(cardsShuffled)


  const restartGame = () => {
    console.log("RESTARTING GAME...")
    document.querySelectorAll(".block").forEach(card => card.remove())
    clearInterval(countDown)
    secondsTimer = countDownStart
    console.log(secondsTimer)
    cardsShuffled = prepareCards()
    printCards(cardsShuffled)
    pairOfCards = []
    isGameOver = false
  }


  //* Print screen 2 - DETAILS
  const gameDetails$$ = document.createElement("div");
  gameDetails$$.className = "miniGame-details"

  const timer$$ = document.createElement("div");
  const h2Timer$$ = document.createElement("h2");
  const pTimer$$ = document.createElement("p");
  timer$$.className = "timer"
  h2Timer$$.textContent = "TIMER"
  pTimer$$.textContent = countDownStart
  timer$$.append(h2Timer$$, pTimer$$)

  const score$$ = document.createElement("div");
  const h2Score$$ = document.createElement("h2");
  const pScore$$ = document.createElement("p");
  score$$.className = "score"
  h2Score$$.textContent = "SCORE"
  pScore$$.textContent = "000"
  score$$.append(h2Score$$, pScore$$)

  const restartBtn$$ = document.createElement("button");
  restartBtn$$.className = "restart--btn"
  restartBtn$$.textContent = "RESTART"
  timer$$.appendChild(restartBtn$$)
  restartBtn$$.addEventListener("click", restartGame)

  const h1$$ = document.createElement("h1");
  h1$$.textContent = "-MEMORY GAME-"

  gameDetails$$.append(h1$$, timer$$, score$$)
  elementTwoToAppend.appendChild(gameDetails$$)




  //! logic
  
  const stopClicks = (e) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const startCountDown = (secondsTimer) => {
    const countDown = setInterval(() => {
      secondsTimer--
      pTimer$$.textContent = secondsTimer
      if (secondsTimer === 0){
        isGameOver = true
        console.log("timer's up!!!  ", isGameOver)
        checkGameOver()
      }
    }, 1000);
    return countDown
  }
  
  const checkGameOver = () => {
    score === numCards * 10 ? isGameOver = true : isGameOver = false
    secondsTimer === 0 ? isGameOver = true : isGameOver = false
    console.log("GAME OVER")
    if (isGameOver) {
      clearInterval(countDown)
      timer$$.classList.toggle("active")
      document.querySelectorAll(".card__face--back").forEach(card => card.addEventListener("click", stopClicks, true))
      secondsTimer = countDownStart
    }
  }

  const flipCard = (e) => {
    console.log(e)
    if (!hasClass(e.path[2], "is-guessed")) {
      pairOfCards.length < 2 && pairOfCards.push(e.target.classList.value)
      e.path[2].classList.add("is-flipped")
      console.log("push "+pairOfCards)
      document.addEventListener("click", stopClicks, true);
      setTimeout(() => {
        document.removeEventListener("click", stopClicks, true);
      }, 1000);
    }else {console.log("card already guessed")}
    if (!hasClass(timer$$, "active")) {
      countDown = startCountDown(secondsTimer)
      timer$$.classList.toggle("active")
    }
  }

  const compareCards = (e) => {
    if (pairOfCards[0] === pairOfCards[1]) {
      const guessedCards = document.querySelectorAll(`.id-${pairOfCards[0]}`)
      guessedCards.forEach(card => {
        card.classList.add("is-guessed")
      })
      score += 20 //10pts each card
      pScore$$.textContent = score
      checkGameOver()
      console.log(isGameOver)
      console.log("===")
      return true
    } else {return false}
  }

  const flipBack = (e) => {
    const cardsToFlip = document.querySelectorAll(".is-flipped")
    cardsToFlip.forEach(card => {
      if(!hasClass(card, "is-guessed")) {
        card.classList.toggle("is-flipped")
      }
    })
    console.log(pairOfCards)
    pairOfCards = []
  }



  const logic = (e) => {
    flipCard(e)
    pairOfCards.length === 2 && compareCards()
    pairOfCards.length === 2 && setTimeout(() => {flipBack()}, 900)
  }

};
