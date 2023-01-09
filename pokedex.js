
import {
  removeElements,
  hasClass,
  randomNumber,
  threeDigitNumber,
  toggleClasses,
  getRandomItems,
  shuffle
} from "./helpers.js";

import {bodyScreenPokemons$$,
  bodyPokedexScreen$$,
  detailsScreen$$,
  gameLidScreen$$,
  gameBodyScreen$$,
  menuScreen$$,
  viewBtn$$,
  menuBtn$$,
  searchBtn$$,
  menuBtnPokedex$$,
  menuBtnGames$$,
  menuBtnScanner$$,
  searchInput$$,
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

import { memoryGame } from "./mini-games_memory.js";

const pokemonsDetails = [];
let evolutions = {
  prev: 'prev',
  next: 'next'
}

//! MENU
const showMenu = () => {
  if (hasClass(gameLidScreen$$, "display-none")) {
    toggleClasses(menuScreen$$, ["display-none"]);
    toggleClasses(detailsScreen$$, ["display-none"]);
  } else {
    toggleClasses(menuScreen$$, ["display-none"]);
    toggleClasses(gameLidScreen$$, ["display-none"]);
  }
};
menuBtn$$.addEventListener("click", showMenu);
menuBtnGames$$.addEventListener("click", () => {
  toggleClasses(gamesList$$, ["hidden"]);
});

//! Filter - search
viewBtn$$.addEventListener("click", (e) => {
  toggleClasses(bodyScreenPokemons$$, ["grid", "list"]);
  if (e.target.textContent === "grid") {
    viewBtn$$.textContent = "list";
  } else {
    viewBtn$$.textContent = "grid";
  }
});

const searchPokemon = (input) => {
  const filter = input.value;
  let searchResults = 0;
  for (let i = 0; i < pokemonsDetails.length; i++) {
    const pkm = pokemonsDetails[i];
    const searchTarget = pkm.name;
    if (!searchTarget.includes(filter)) {
      document.getElementById(pkm.id).classList.add("display-none");
    } else {
      document.getElementById(pkm.id).classList.remove("display-none");
      searchResults++;
    }
  }
  searchResult$$.textContent = `Found: ${threeDigitNumber(searchResults)}`;
};

searchInput$$.addEventListener("keyup", () => {
  searchPokemon(searchInput$$);
});


//!Check evolutions
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
prevEvolBtn$$.addEventListener("click", (e)=>{
  printDetails(e, evolutions.prev)
  checkEvolutions(evolutions.prev)
})
nextEvolBtn$$.addEventListener("click", (e)=>{
  printDetails(e, evolutions.next)
  checkEvolutions(evolutions.next)
})

//! start fetching informarion and printing it:
//*Printing details of the pokemon clicked
const printDetails = (e, pokemon) => {
  detailsBody$$.classList.remove("hidden");

  //? removes previous entries
  removeElements(detailsFlavors$$, ".entry");
  removeElements(detailsTypes$$, "span");

  //? print detail on lid-screen
  //? NAME+NUMBER
  detailsName$$.textContent = pokemon.name;
  detailsNumber$$.textContent = `# ${pokemon.id}`;
  //?TYPES
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

//*more data about the species to use after getting all pokemons
const getSpecieData = async (pokemon) => {
  const response = await fetch(pokemon.species.url);
  const resultData = await response.json();
  const {
    color,
    egg_groups,
    evolution_chain,
    flavor_text_entries,
    habitat,
    is_legendary,
  } = resultData;

  //clean data
  const eggs = egg_groups.map((egg) => {
    return egg.name;
  });

  const text_entries = [];
  flavor_text_entries.forEach((entry) => {
    if (entry.language.name === "es" && text_entries.length < 3) {
      text_entries.push(entry.flavor_text);
    }
  });

  //add data to the pokemon
  const data = {
    color: color.name,
    habitat: habitat.name,
    egg_groups: eggs,
    legendary: is_legendary,
    evolution_forms: evolution_chain.url,
    text_entries: text_entries,
  };

  return data;
};

//*get all pokemons details and saving in an Array after fetching the list. Then print information.
const getAllPokemons = async (pokemonsList) => {
  let captures = 0;
  let sights = 0;

  for (const pokemon of pokemonsList) {
    const response = await fetch(pokemon.url);
    const result = await response.json();

    //clean data
    const { id, height, weight, name, species, sprites, types } = result;
    const typesList = types.map((type) => type.type.name);
    const specieData = await getSpecieData(result);
    const newId = threeDigitNumber(id);

    pokemonsDetails.push({
      name: pokemon.name,
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
    });

    const pokemonInArray = pokemonsDetails.filter(
      (pkm) => pkm.name === pokemon.name
    )[0];

    //? print pokemons GRID on body-screen
    const pokeItem$$ = document.createElement("div");
    const pokeItem_Img$$ = document.createElement("img");
    pokeItem$$.className = `pokemons__item`;
    pokemonInArray.types.forEach(type => {
      pokeItem$$.classList.add(type)
    })
    pokeItem$$.id = pokemonInArray.id;
    pokeItem_Img$$.src = pokemonInArray.sprites.front_default;
    pokeItem$$.appendChild(pokeItem_Img$$);
    bodyScreenPokemons$$.appendChild(pokeItem$$);

    pokemonInArray.caught === true && pokeItem$$.classList.add("caught");
    pokemonInArray.seen === true && pokeItem$$.classList.add("seen");
    pokemonInArray.legendary === true && pokeItem$$.classList.add("legendary");

    //? print pokemons LIST on body-screen but HIDDEN
    const pokeItem_name$$ = document.createElement("span");
    const pokeItem_number$$ = document.createElement("span");
    pokeItem_name$$.textContent = pokemonInArray.name;
    pokeItem_number$$.textContent = `${pokemonInArray.id} - `;
    pokeItem$$.appendChild(pokeItem_number$$);
    pokeItem$$.appendChild(pokeItem_name$$);
    bodyScreenPokemons$$.appendChild(pokeItem$$);

    //? show caught/seen indicator
    pokemonInArray.caught === true && captures++;
    pokemonInArray.seen === true && sights++;

    //?click on pokeItem$$
    pokeItem$$.addEventListener("click", (e) => {
      //parameter => pokemon on the pokemonDetails array, not the fetch result
      printDetails(e, pokemonInArray);
      checkEvolutions(pokemonInArray)
    });
  }
  pokemonCaughts$$.textContent = captures;
  pokemonSeen$$.textContent = sights;
};

//* fetching the pokemons from the api

fetch("https://pokeapi.co/api/v2/pokemon?offset=0&limit=151")
  .then((res) => res.json())
  .then((res) => {
    const pokemons = res.results.map((pokemon) => {
      return pokemon;
    });

    getAllPokemons(pokemons);
  });



//! MINIGAMES
const showGameScreen = () => {
  toggleClasses(bodyPokedexScreen$$, ["display-none"]);
  toggleClasses(gameLidScreen$$, ["display-none"]);
  toggleClasses(gameBodyScreen$$, ["display-none"]);
  toggleClasses(menuScreen$$, ["display-none"]);
  toggleClasses(gamesList$$, ["hidden"]);
};

const gameStartBtn$$ = document.querySelectorAll(".game__opt");
gameStartBtn$$[0].addEventListener("click", (e) => {
  memoryGame(gameBodyScreen$$, gameLidScreen$$, pokemonsDetails)
  showGameScreen();
});



