// Execution Flow
//----------------//
// Pull random pokemon from API, add catch & run away button options
// Currently displayed wild pokemon is not stored on server and will change on refresh
// Run away will pull a new pokemon from the API without refreshing page
// Catch will check against a catch percentage to determine if pokemon is caught or gets away
// If it gets away, the same functionality as the run away button is invoked
// If caught, the pokemon's object data is stored on the server and a new card is created and appended to the Pokedex
// The page does not pull data from the server to build the Pokedex unless the page is refreshed
// On release, a pokemon's data is deleted from the server and the card removed from the Pokedex

/* Init */
getAPokemon();
buildPokedex();

/* Functions */
function randomNumGen(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function catchChance() {
  return Math.random() > 0.3;
}

function createNewElement(elType, elClass = "", text = "") {
  const newElement = document.createElement(elType);
  newElement.className = elClass;
  newElement.textContent = text;
  return newElement;
}

function typeBackground(typeArray) {
  // Parses pokemon types and returns an array of background colors depending on type(s);
  const backgroundColors = {
    normal: "#A15621",
    fire: "#F08030",
    fighting: "#C03028",
    water: "#6890F0",
    flying: "#B7A3F2",
    grass: "#8FD16E",
    poison: "#B061B0",
    electric: "#F8D030",
    ground: "#E0C068",
    psychic: "#F85888",
    rock: "#B8A038",
    ice: "#98D8D8",
    bug: "#B7C446",
    dragon: "#885AF9",
    ghost: "#705898",
    steel: "#B8B8D0",
    fairy: "#EE99AC",
  };

  const gradientColors = `linear-gradient(${typeArray
    .map((element) => backgroundColors[element])
    .join(",")} ,#FFF)`;

  return gradientColors;
}

function createBaseCard() {
  const cardContainer = createNewElement("div", "card");
  cardContainer.appendChild(createNewElement("h3", "card-header"));
  cardContainer.appendChild(createNewElement("img", "card-img-top"));
  cardContainer.appendChild(createNewElement("div", "card-body"));
  return cardContainer;
}

function createWildCard(pokemonObj) {
  // create buttons & listeners
  const pokeballBtn = createNewElement(
    "button",
    "btn btn-primary",
    "Throw a PokeBall!"
  );
  const runBtn = createNewElement("button", "btn btn-warning", "Run Away!");

  pokeballBtn.addEventListener("click", () => {
    if (document.querySelector("#pokedexDisplay").childElementCount > 5) {
      alert("Your PokeBag is full! Release some Pokemon to catch more!");
    } else if (catchChance()) {
      sendDataToServer(pokemonObj, "pokedex");
      createPokedexCard(pokemonObj);
      clearWildPokemon();
      getAPokemon();
    } else {
      alert(`The wild ${capitalizeName(pokemonObj.id)} got away!`);
      clearWildPokemon();
      getAPokemon();
    }
  });

  runBtn.addEventListener("click", () => {
    clearWildPokemon();
    getAPokemon();
  });

  // build card
  const newCard = createBaseCard();
  newCard.children[0].textContent = `A wild ${capitalizeName(
    pokemonObj.id
  )} has appeared!`;
  newCard.children[1].src = pokemonObj.pic;
  newCard.children[1].style["background-image"] = typeBackground(
    pokemonObj.types
  );
  newCard.children[2].appendChild(pokeballBtn);
  newCard.children[2].appendChild(runBtn);

  document.querySelector("#wildPokemonContainer").appendChild(newCard);
}

function createPokedexCard(pokemonObj) {
  // create buttons & listeners
  const deleteBtn = createNewElement("button", "btn btn-danger", "release");

  deleteBtn.addEventListener("click", (e) => {
    const pokeName = e.target.parentElement.previousSibling.previousSibling.textContent;
    deleteDataFromServer("pokedex", pokeName.toLowerCase());
    alert(
      `${pokeName} has been released back into the wild! They'll miss you!`
    );

    e.target.parentElement.parentElement.remove();
  });

  // build card
  const newCard = createBaseCard();
  newCard.classList.add("caught");
  newCard.children[0].textContent = capitalizeName(pokemonObj.id);
  newCard.children[1].src = pokemonObj.pic;
  newCard.children[1].style["background-image"] = typeBackground(
    pokemonObj.types
  );
  newCard.children[2].appendChild(deleteBtn);

  document.querySelector("#pokedexDisplay").appendChild(newCard);
}

function pokeObjHandler(pokeObject) {
  // Saves relevant data retrieved from API
  let newPokeTypes = [];
  pokeObject.types.forEach((element) => {
    newPokeTypes.push(element.type.name);
  });

  let newPokemon = {
    id: pokeObject.name,
    pic: pokeObject.sprites.other["official-artwork"].front_default,
    types: newPokeTypes,
  };

  return newPokemon;
}

function fetchEm(randomNum) {
  // Fetch a pokemon from passed in random num and call createWildCard() on it
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`)
    .then((response) => response.json())
    .then((data) => pokeObjHandler(data))
    .then((newPokemon) => {
      createWildCard(newPokemon);
    });
}

function getAPokemon() {
  // range (1, 151) for gen 1 pokemon
  fetchEm(randomNumGen(1, 151));
}

function clearWildPokemon() {
  const currentPokemon = document.querySelector("#wildPokemonContainer");
  currentPokemon.removeChild(currentPokemon.firstChild);
}

function buildPokedex() {
  getDataFromServer("pokedex").then((data) =>
    data.forEach((pokemon) => createPokedexCard(pokemon))
  );
}

function capitalizeName(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function getDataFromServer(location) {
  return fetch(`http://localhost:3000/${location}`).then((response) =>
    response.json()
  );
}

function sendDataToServer(pokeObject, whereToSend) {
  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(pokeObject),
  };

  fetch(`http://localhost:3000/${whereToSend}`, configurationObject);
}

function deleteDataFromServer(location, pokemon) {
  const configurationObject = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  fetch(`http://localhost:3000/${location}/${pokemon}`, configurationObject);
}
