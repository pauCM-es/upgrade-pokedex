export const removeElements =  (parent, elements) => {
  const elementsToRemove = parent.querySelectorAll(elements);
  elementsToRemove.forEach((element) => element.remove());
};

export const hasClass = (element, className) => {
  return element.classList.value.includes(className)
}

export const randomNumber = (minNum, maxNum) => {
    const rando = Math.floor(Math.random() * (maxNum - minNum + 1) + minNum)
    return rando 
}

export const threeDigitNumber = (id) => {
  if (id < 10) {
    return `00${id}`;
  } else if (id < 100) {
    return `0${id}`;
  } else {
    return `${id}`;
  }
}

//let toggle one class or switch one for another
export const toggleClasses = (element, classes) => {
  for (let i = 0; i < classes.length; i++) {
    const classItem = classes[i];
    element.classList.toggle(classItem)
  }
}

//get n random items from a list of things. (without having been duplicated)
export const getRandomItems = (amountItems, arrayOfObjects, objectProp) => {
  const randomItems = []
  console.log(arrayOfObjects.length)
  const lastIndex = arrayOfObjects.length

  for (let i = 0; i < amountItems; i++) {
    let randomIndex = randomNumber(0, lastIndex)
    while (randomItems.includes(arrayOfObjects[randomIndex][objectProp])) {
      randomIndex = randomNumber(0, lastIndex)
    }
    randomItems.push(arrayOfObjects[randomIndex][objectProp])
  }
  return randomItems
}

//it choses a random element from an array (this one is removed) and push it to a new array.
//loop while the original array still has elements (lenght > 0) 
export const shuffle = (arrayToShuffle) => {
  const shuffled = []
  let lastIndex = arrayToShuffle.length -1
  let array = [...arrayToShuffle]
  let randomIndex
  while (array.length > 0) {
    randomIndex = randomNumber(0, lastIndex)
    const itemDelete = array.splice(randomIndex, 1)
    shuffled.push(itemDelete[0])
    lastIndex = array.length -1
  }
  return shuffled
}

export const stopClicks = (e) => {
  e.stopPropagation();
  e.preventDefault();
};

export const checkTimer = (numero) => {
  if (numero === 0) {
    isGameOver = true
    timerIsActive = false
    return true
  }
}

export const startCountDown = (seconds) => {
  interval = setInterval(() => {
    console.log(seconds);
    seconds--;
    timerSeconds$$.textContent = seconds
    checkTimer(seconds) && clearInterval(interval)
}, 1000);
}

export const getElement = (selector) => {
  const element = document.querySelector(selector)
  return element
}

export const randomBoolean = () => {
  const bool = randomNumber(0,1) === 1  ? true : false
  return bool
}

