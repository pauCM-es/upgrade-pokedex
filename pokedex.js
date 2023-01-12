
import {
  removeElements,
  hasClass,
  randomNumber,
  threeDigitNumber,
  toggleClasses,
  getRandomItems,
  getElement,
} from "./helpers.js";

import {bodyScreenPokemons$$,
  bodyPokedexScreen$$,
  detailsScreen$$,
  gameLidScreen$$,
  gameBodyScreen$$,
  menuScreen$$,
  viewBtn$$,
  menuBtn$$,
 clearBtn$$,
  filtersBtn$$ ,
  menuBtnPokedex$$,
  menuBtnGames$$,
  menuBtnScanner$$,
  searchInput$$,
  filterNav$$,
  detailsBody$$,
  detailsName$$,
  detailsNumber$$,
  detailsImg$$,
  detailsHabitat$$,
  detailsWeight$$,
  detailsHeight$$,
  detailsColor$$,
  detailsFlavors$$,
  detailsTypes$$,
  pokemonCaughts$$,
  pokemonSeen$$,
  searchResult$$,
  gamesList$$,
  prevEvolBtn$$,
  prevEvolName$$,
  nextEvolBtn$$,
  nextEvolName$$,
} from "./elements.js"

import { memoryGame } from "./mini-games_memory.js"
import { whackGame } from "./mini-games_whack.js"

let limitOfPokemons = 151
const pokemonsDetails = [];
let evolutions = {
  prev: 'prev',
  next: 'next'
}
let typesFilters = []
let captures = 0;
let sights = 0;
let filtersUsed = []

// limitOfPokemons = prompt("Hasta que pokemon quieres ver?", 151)
// if (!limitOfPokemons > 1 && limitOfPokemons < 1010) alert("otra vez, plis...")

//! MENU-----------------------------------------------------------------
export const showMenu = () => {
  if (hasClass(gameLidScreen$$, "display-none")) {
    toggleClasses(menuScreen$$, ["display-none"]);
    toggleClasses(detailsScreen$$, ["display-none"]);
  } else {
    toggleClasses(menuScreen$$, ["display-none"]);
    toggleClasses(gameLidScreen$$, ["display-none"]);
  }
};


//! SEARCH--------------------------------------------------------------
const searchPokemon = (input) => {
  const filter = input.value;
  let searchResults = 0;
  for (const pokemon of pokemonsDetails) {
    const searchTarget = pokemon.name;
    const searchTarget2 = pokemon.id
    if (!searchTarget.includes(filter) && !searchTarget2.includes(filter)) {
      document.getElementById(pokemon.id).classList.add("display-none");
    } else {
      document.getElementById(pokemon.id).classList.remove("display-none");
      searchResults++;
    }
  }
  searchResult$$.textContent = `Found: ${threeDigitNumber(searchResults)}`;
};

//! FILTERS-------------------------------------------------------------
const reloadDisplay = (pokemonsList) => {
  for (const pokemon of pokemonsList) {
    pokemon.display && printPokemonItem(pokemon)
  }
}
const removePokemonItems = () => {
  bodyScreenPokemons$$.innerHTML = ''
}

const evaluatesFilters = (filters) => {
  for (const pokemon of pokemonsDetails) {
    pokemon.display = true
    filters.forEach(filter => {
      if (!pokemon.types.includes(filter)) {
        pokemon.display = false
      }
    })
  }

  removePokemonItems()
  reloadDisplay(pokemonsDetails) //print again pokeItems with the pokemons that have porpierty display:true
  toggleClasses(filterNav$$, ["showDown"])  //hide filters nav
}

const filterPokemon = (e) => {                           
  const filter = e.target.textContent

  if (filtersUsed.includes(filter) ) { 
    filtersUsed.splice(filtersUsed.indexOf(filter), 1)   
  } else {
    filtersUsed.push(filter)                              
  }
  evaluatesFilters(filtersUsed)
  
  let searchResults = 0;
  pokemonsDetails.forEach(pokemon => {pokemon.display && searchResults++})
  searchResult$$.textContent = `Found: ${threeDigitNumber(searchResults)}`;
};

const getBtnsFilters = (listPokemons) => {
  for(const pokemon of listPokemons) {
    pokemon.types.forEach(type => {
    
      if (typesFilters[type] === undefined) {

        //Propierty of filter active: true/false
        typesFilters[type] = false
        
        //html Btn element
        const span$$ = document.createElement("span")
        span$$.textContent = type
        filterNav$$.appendChild(span$$)
        
        //Functionality
        span$$.addEventListener("click", (e)=>{
          span$$.classList.toggle("active")
          typesFilters[e.target.textContent] = !typesFilters[e.target.textContent]
          filterPokemon(e)
        })
      }
    })
  }
} 

//! CHECK EVOLUTIONS-----------------------------------------------------
//it compairs the evolutionChain propierty (url) of the previous and the next pokemon
// if === they belong to the same evolution group. 
const checkEvolutions = (pokemon) => {
  const indexCurrentPokemon = pokemon.id -1
  const currentPokemon = pokemonsDetails[indexCurrentPokemon]
  const prevPokemon = pokemonsDetails[indexCurrentPokemon - 1]
  const nextPokemon = pokemonsDetails[indexCurrentPokemon + 1]

  if (prevPokemon.evolution_forms === currentPokemon.evolution_forms) {
    prevEvolName$$.textContent = prevPokemon.name
    evolutions.prev = prevPokemon
  }else {prevEvolName$$.textContent = "---"}

  if (nextPokemon.evolution_forms === currentPokemon.evolution_forms) {
    nextEvolName$$.textContent = nextPokemon.name
    evolutions.next = nextPokemon
  }else {nextEvolName$$.textContent = "---"}
}

//! PRINT DETAILS of clicked pokemon-------------------
const printDetails = (e, pokemon) => {
  detailsBody$$.classList.remove("hidden");

  //* removes previous entries------------------------
  removeElements(detailsFlavors$$, ".entry");
  removeElements(detailsTypes$$, "span");

  //* print detail on lid-screen----------------------
  //? NAME+NUMBER
  detailsName$$.textContent = pokemon.name;
  detailsNumber$$.textContent = `# ${pokemon.id}`;

  //? TYPES
  pokemon.types.forEach(type => {
    const span$$ = document.createElement('span')
    span$$.textContent = type
    detailsTypes$$.appendChild(span$$) 
  })

  //? IMAGE
  detailsImg$$.src = pokemon.sprites.other["official-artwork"].front_default;

  //? INFORMATION
  detailsHabitat$$.textContent = `Habitat: ${pokemon.habitat}`;
  detailsWeight$$.textContent = `Weight: ${pokemon.weight}`;
  detailsHeight$$.textContent = `Height: ${pokemon.height}`;
  detailsColor$$.textContent = `Color: ${pokemon.color}`;
  pokemon.text_entries.forEach((entry) => {
    const p$$ = document.createElement("p");
    p$$.className = "entry";
    p$$.textContent = entry;
    detailsFlavors$$.appendChild(p$$);
  });

};

//! PRINT POKE ITEM -------------------------------------------------
    //pokemonInArray is the one with all the data after merging the second fetch
  const printPokemonItem = (pokemon) => {
    const pokeItem$$ = document.createElement("div");
    pokeItem$$.className = `pokemons__item`;
    pokeItem$$.id = pokemon.id;
    pokemon.types.forEach(type => {
      pokeItem$$.classList.add(type)
    })
    pokeItem$$.innerHTML = 
    `
    <img src="${pokemon.sprites.front_default}"/>
    <span>${pokemon.id} - </span>
    <span>${pokemon.name}</span>
    `
    bodyScreenPokemons$$.appendChild(pokeItem$$);
    
    pokemon.caught === true && pokeItem$$.classList.add("caught");
    pokemon.seen === true && pokeItem$$.classList.add("seen");
    pokemon.legendary === true && pokeItem$$.classList.add("legendary");

    
    //?click on pokeItem$$
    pokeItem$$.addEventListener("click", (e) => {
      //parameter => pokemon on the pokemonDetails array, not the fetch result
      printDetails(e, pokemon);
      checkEvolutions(pokemon)
    });
  }









//! FETCH FOR POKEMONS DATA AND PRINT:----------------------


//* ADDITIONAL DATA about the species to use after getting all pokemons-----
const getSpecieData = async (pokemon) => {
  const response = await fetch(pokemon.species.url);
  const resultData = await response.json();
  const {
    color,
    evolution_chain,
    flavor_text_entries,
    habitat,
    is_legendary,
  } = resultData;

  //clean data
  const text_entries = [];
  flavor_text_entries.forEach((entry) => {
    if (entry.language.name === "es" && text_entries.length < 3) {
      text_entries.push(entry.flavor_text);
    }
  });

  //add data to the pokemonDetails
  const data = {
    color: color.name,
    habitat: habitat.name,
    legendary: is_legendary,
    evolution_forms: evolution_chain.url,
    text_entries: text_entries,
  };

  return data;
};




//* get ALL POKEMONS DETAILS and saving in an Array after fetching the list. 
//* Then print information for that pokemon.--------------------------------
const getAllPokemons = async (limitPokemons) => {
  
  for (let i = 0; i < limitPokemons; i++) {
    const pokemonId = i+1;
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemonId}`
  
    const response = await fetch(url);
    const result = await response.json();
    const specieData = await getSpecieData(result);

    //clean data
    const { id, height, weight, name, species, sprites, types } = result;
    const typesList = types.map((type) => type.type.name);
    const newId = threeDigitNumber(id);

    pokemonsDetails.push({
      name: result.name,
      id: newId,
      height,
      weight,
      name,
      species,
      sprites,
      types: typesList,
      ...specieData,
      caught: false,
      seen: true,
      display: true
    });
      const pokemonInArray = pokemonsDetails.filter(
      (pkm) => pkm.name === result.name
      )[0];
      
      printPokemonItem(pokemonInArray)
      
      //? show caught/seen indicator
      pokemonInArray.caught  && captures++;
      pokemonInArray.seen && sights++;
  }

  getBtnsFilters(pokemonsDetails)
  pokemonCaughts$$.textContent = captures;
  pokemonSeen$$.textContent = sights;
  console.log(pokemonsDetails)
  
}

getAllPokemons(limitOfPokemons)






//! ACTIONS outside of the pokemons items----------------------------

//? MENU BTN
menuBtn$$.addEventListener("click", showMenu);
menuBtnGames$$.addEventListener("click", () => {
  toggleClasses(gamesList$$, ["hidden"]);
});

//? CHANGE VIEW GRID/LIST=================================
viewBtn$$.addEventListener("click", (e) => {
  toggleClasses(bodyScreenPokemons$$, ["grid", "list"]);
  if (e.target.textContent === "grid") {
    viewBtn$$.textContent = "list";
  } else {
    viewBtn$$.textContent = "grid";
  }
});

//? SEARCH INPUT==========================================
searchInput$$.addEventListener("input", () => {
  searchPokemon(searchInput$$);
});

//? CLEAR ALL FILTERS BTN=====================================
clearBtn$$.addEventListener("click", (e) => {
  //clean everythings
  e.preventDefault()
  removePokemonItems()
  searchInput$$.value = ''
  filtersUsed = []
  //remove active class from filter btns
  const btns = filterNav$$.querySelectorAll('span')
  btns.forEach(btn => {
    hasClass(btn, "active") && btn.classList.remove("active")
  })
  //display all pokemons and print the pokeItems
  pokemonsDetails.forEach(pokemon => {
    pokemon.display = true
    printPokemonItem(pokemon)
  })
})

//? TYPES FILTERS NAV======================================
filtersBtn$$.addEventListener("click", (e) => {
  e.preventDefault()
  toggleClasses(filterNav$$, ["showDown"])  
})

//? EVOLUTIONS BTNS======================================
prevEvolBtn$$.addEventListener("click", (e)=>{
  printDetails(e, evolutions.prev)
  checkEvolutions(evolutions.prev)
})
nextEvolBtn$$.addEventListener("click", (e)=>{
  printDetails(e, evolutions.next)
  checkEvolutions(evolutions.next)
})



//! MINIGAMES----------------------------------------------------
const showGameScreen = () => {
  toggleClasses(bodyPokedexScreen$$, ["display-none"]);
  toggleClasses(gameLidScreen$$, ["display-none"]);
  toggleClasses(gameBodyScreen$$, ["display-none"]);
  toggleClasses(menuScreen$$, ["display-none"]);
  toggleClasses(gamesList$$, ["hidden"]);
};

const gameStartBtn$$ = document.querySelectorAll(".game__opt");

//MEMORY
gameStartBtn$$[0].addEventListener("click", (e) => {
  memoryGame(gameBodyScreen$$, gameLidScreen$$, pokemonsDetails)
  showGameScreen();
});
//WHACK A PKMON
gameStartBtn$$[1].addEventListener("click", (e) => {
  whackGame(gameBodyScreen$$, gameLidScreen$$, )
  showGameScreen();
});



