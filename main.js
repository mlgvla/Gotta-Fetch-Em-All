/* Init */
document.addEventListener("DOMContentLoaded", onPageLoad);

/* Umbrella Functions */
async function onPageLoad() {
  // default page load action, fetch a random pokemon from api and build pokedex based on data in local server
  getAPokemon();
  buildPokedex(await retrieveLocalData("pokedex"));
}

async function getAPokemon() {
  // passes random number to fetchEm and clears the current wild pokemon card from the DOM
  // range (1, 151) for gen 1 pokemon
  const newPokemon = await fetchEm(randomNumGen(1, 151));
  const parsedPokemon = pokeObjHandler(newPokemon);
  clearDOM("#wildPokemonContainer");
  createWildCard(parsedPokemon);
}

function buildPokedex(pokedexArray) {
  // Clears current children from the pokedex and builds pokedex cards for each object in the passed in array
  clearDOM("#pokedexDisplay");
  pokedexArray.forEach((pokemonObj) => createPokedexCard(pokemonObj));
  checkPokedexPopulated();
}

function createWildCard(pokemonObj) {
  // creates and appends new wild pokemon card to the DOM
  const pokeballBtn = createNewElement("button","btn btn-primary","Throw a PokeBall!");
  const runBtn = createNewElement("button", "btn btn-warning", "Run Away!");

  pokeballBtn.addEventListener("click", () => {
    if (document.querySelector("#pokedexDisplay").childElementCount > 5) {
      alert("Your PokeBag is full! Release some Pokemon to catch more!");
    } else if (catchChance()) {
      caughtPokemon(pokemonObj);
    } else {
      alert(`The wild ${capitalizeName(pokemonObj.name)} got away!`);
      getAPokemon();
    }
  });

  runBtn.addEventListener("click", getAPokemon);

  const newCard = createBaseCard();
  newCard.children[0].textContent = `A wild ${capitalizeName(pokemonObj.name)} has appeared!`;
  newCard.children[1].src = pokemonObj.pic;
  newCard.children[1].style["background-image"] = typeBackground(pokemonObj.types);
  newCard.children[2].appendChild(pokeballBtn);
  newCard.children[2].appendChild(runBtn);

  document.querySelector("#wildPokemonContainer").appendChild(newCard);
}

function createPokedexCard(pokemonObj) {
  // creates and appends new pokedex card to DOM
  const deleteBtn = createNewElement("button", "btn btn-danger", "Release");
  const renameBtn = createNewElement("button", "btn btn-success", "Rename");

  deleteBtn.addEventListener("click", (e) => {
    const pokeName = e.target.parentElement.firstChild.textContent;
    releasePokemon(pokeName);
    alert(`${pokeName} has been released back into the wild! They'll miss you!`);
    e.target.parentElement.remove();
    checkPokedexPopulated();
  });

  renameBtn.addEventListener("click", (e) => {
    const pokeName = e.target.parentElement.firstChild.textContent;
    const nickname = prompt(`What nickname would you like to give ${pokeName}?`).toLowerCase();
    changePokemonName(pokeName, nickname);
    e.target.parentElement.firstChild.textContent = capitalizeName(nickname);
  });

  const newCard = createBaseCard();
  newCard.classList.add("caught");
  newCard.children[0].textContent = capitalizeName(pokemonObj.name);
  newCard.children[1].src = pokemonObj.pic;
  newCard.children[1].style["background-image"] = typeBackground(pokemonObj.types);
  newCard.appendChild(renameBtn);
  newCard.appendChild(deleteBtn);

  document.querySelector("#pokedexDisplay").appendChild(newCard);
}

async function caughtPokemon(pokemon) {
  // stores caught pokemon object on the local server
  // then retrieves all saved pokemon from the server, regenerates pokedex, and gets new wild pokemon
  const response = await saveLocalData(pokemon, "pokedex");
  onPageLoad();
  return response;
}

async function releasePokemon(name) {
  // removes pokemon from the local server
  const pokeArray = await retrieveLocalData("pokedex");
  const pokeID = findPokemonID(pokeArray, name.toLowerCase())
  await deleteLocalData("pokedex", pokeID);
}

async function changePokemonName(oldName, newName) {
  // renames pokemon object on the local server
  const pokeArray = await retrieveLocalData("pokedex");
  const pokeID = findPokemonID(pokeArray, oldName.toLowerCase());
  patchLocalData("pokedex", pokeID, newName);
}

/* Base Functions */
function checkPokedexPopulated() {
  if (document.querySelector("#pokedexDisplay").childElementCount === 0) {
    document.querySelector("#pokedexDisplay").textContent = "No Pokemon currently in your bag! Catch some to start your collection!"
  }
}

async function fetchEm(randomNum) {
  // accepts a random number and retrieves pokemon json data from API
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`);
  const data = await response.json();
  return data;
}

function clearDOM(selector) {
  // clear DOM container by selector
  document.querySelector(selector).replaceChildren();
}

function randomNumGen(min, max) {
  // returns random number in range specified
  return Math.floor(Math.random() * (max - min) + min);
}

function catchChance() {
  // returns odds of catching pokemon (0-1)
  return Math.random() > 0.3;
}

function createNewElement(elType, elClass = "", text = "") {
  // return new base element
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
  // returns new card with default classed title, image, and body elements
  const cardContainer = createNewElement("div", "card");
  cardContainer.appendChild(createNewElement("h3", "card-header"));
  cardContainer.appendChild(createNewElement("img", "card-img-top"));
  cardContainer.appendChild(createNewElement("div", "card-body"));
  return cardContainer;
}

function pokeObjHandler(pokeObject) {
  // parses data returned from API and returns relevant parts in an object
  let newPokeTypes = [];
  pokeObject.types.forEach((element) => {
    newPokeTypes.push(element.type.name);
  });

  let newPokemon = {
    name: pokeObject.name,
    species: pokeObject.name,
    pic: pokeObject.sprites.other["official-artwork"].front_default,
    types: newPokeTypes,
  };

  return newPokemon;
}

function findPokemonID(pokedexArray, pokemonName) {
  // parses stored pokemon from the local server to find the relevant ID by the pokemon's current nickname
  for (object of pokedexArray) {
    if (object.name === pokemonName) {
      return object.id;
    }
  }
}

function capitalizeName(name) {
  // capitalize pokemon name
  return name[0].toUpperCase() + name.slice(1);
}

/* Local Server Functions */
async function retrieveLocalData(location) {
  const response = await fetch(`http://localhost:3000/${location}`);
  const data = await response.json();
  data.sort((a,b) => a.name.localeCompare(b.name))
  return data;
}

async function saveLocalData(pokeObject, whereToSend) {
  const configurationObject = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(pokeObject),
  };

  const response = await fetch(`http://localhost:3000/${whereToSend}`,configurationObject);
  return response;
}

async function deleteLocalData(location, pokemon) {
  const configurationObject = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  const response = await fetch(`http://localhost:3000/${location}/${pokemon}`,configurationObject);
  return response;
}

async function patchLocalData(location, ID, newValue) {
  const configurationObject = {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ name: newValue }),
  };

  const response = await fetch(`http://localhost:3000/${location}/${ID}`,configurationObject);
  return response;
}
