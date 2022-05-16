// Execution Flow
//----------------//
// Generate random pokemon
// each pokemon has a catch button
// catch button randomly decides if your throw is successful
// if successful the pokemon is added to your collection
// if not, new pokemon is generated

getAPokemon();

function randomNumGen(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function catchChance() {
  return Math.random() > 0.3;
}

function createBtn(btnText, btnClass) {
  const newBtn = document.createElement("button");
  newBtn.textContent = btnText;
  newBtn.className = btnClass;
  return newBtn;
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

  const gradientColors = typeArray.map((element) => backgroundColors[element]);

  return gradientColors;
}

function createCard(pokemonObj) {
  const cardContainer = document.createElement("div");
  cardContainer.className = "card";

  const cardHeader = document.createElement("h3");
  cardHeader.className = "card-header";
  cardHeader.textContent = `A wild ${capitalizeName(
    pokemonObj.name
  )} has appeared!`;
  cardContainer.appendChild(cardHeader);

  const cardPic = document.createElement("img");
  cardPic.className = "card-img-top";
  cardPic.src = `${pokemonObj.pic}`;
  const backgroundColors = typeBackground(pokemonObj.types);
  cardPic.style["background-image"] = `linear-gradient(${backgroundColors.join(
    ", "
  )}, #FFF)`;
  cardContainer.appendChild(cardPic);

  const cardBody = document.createElement("div");
  cardBody.className = "card-body";
  cardContainer.appendChild(cardBody);

  const pokeballBtn = createBtn("Throw a PokeBall!", "btn btn-primary");
  pokeballBtn.addEventListener("click", () => {
    if (document.querySelector("#pokedexDisplay").childElementCount > 5) {
      alert("Your PokeBag is full! Release some Pokemon to catch more!");
    } else if (catchChance()) {
      moveCardToPokedex(clearWildPokemon());
      getAPokemon();
    } else {
      alert(`The wild ${capitalizeName(pokemonObj.name)} got away!`);
      clearWildPokemon();
      getAPokemon();
    }
  });
  cardBody.appendChild(pokeballBtn);

  const runBtn = createBtn("Run Away!", "btn btn-warning");
  runBtn.addEventListener("click", () => {
    clearWildPokemon();
    getAPokemon();
  });
  cardBody.appendChild(runBtn);

  document.querySelector("#wildPokemonContainer").appendChild(cardContainer);
}

function pokeObjHandler(pokeObject) {
  // Saves relevant data retrieved from API
  let newPokeTypes = [];
  pokeObject.types.forEach((element) => {
    newPokeTypes.push(element.type.name);
  });

  let newPokemon = {
    name: pokeObject.name,
    pic: pokeObject.sprites.other["official-artwork"].front_default,
    types: newPokeTypes,
  };

  return newPokemon;
}

function fetchEm(randomNum) {
  // Fetch a pokemon from passed in random num and call createCard() on it
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`)
    .then((response) => response.json())
    .then((data) => pokeObjHandler(data))
    .then((newPokemon) => {
      createCard(newPokemon);
    });
}

function getAPokemon() {
  // range (1, 151) for gen 1 pokemon
  fetchEm(randomNumGen(1, 151));
}

function clearWildPokemon() {
  // clears current wild pokemon and returns its card
  const currentPokemon = document.querySelector("#wildPokemonContainer");
  const pokeCard = currentPokemon.firstChild;
  currentPokemon.removeChild(currentPokemon.firstChild);
  return pokeCard;
}

function moveCardToPokedex(card) {
  const pokedex = document.querySelector("#pokedexDisplay");
  card.className = "card caught";

  // change card header to pokemon name
  const cardText = card.textContent.split(" ");
  card.firstChild.textContent = cardText[2];

  // remove pokeball/run buttons
  card.removeChild(card.lastChild);

  // add release button to card
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "release";
  deleteBtn.className = "btn btn-danger";
  deleteBtn.addEventListener("click", (e) => {
    alert(
      `${e.target.previousSibling.previousSibling.textContent} has been released back into the wild! They'll miss you!`
    );
    e.target.parentElement.remove();
  });
  card.appendChild(deleteBtn);

  pokedex.appendChild(card);
}

function capitalizeName(name) {
  return name[0].toUpperCase() + name.slice(1);
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

function deleteDataFromServer() {
  const configurationObject = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
  };

  fetch(`http://localhost:3000/wildPokemon/1`, configurationObject);
}
