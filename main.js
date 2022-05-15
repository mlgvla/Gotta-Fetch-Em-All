// Execution Flow
//----------------
// 1 - getSomePokemon calls rng for a given quantity of random nums
// 1a - getSomePokemon calls fetchEm to fetch pokemon data
// 1b - fetchEm calls createCard on each pokemon object retrieved and appends to dom

// But what if...
// Generate random pokemon
// each pokemon has a catch button
// catch button randomly decides if your throw is successful
// if successful the pokemon is added to your collection
// if not, new pokemon is generated

getSomePokemon(6);

function getSomePokemon(quantity) {
  const pokeNums = randomNumGen(1, 151, quantity);
  fetchEm(pokeNums);
}

function randomNumGen(min, max, quantity) {
  // Returns an array of the specified quantity of random numbers
  const randomArray = [];

  for (let i = 0; i < quantity; i++) {
    randomArray.push(Math.floor(Math.random() * (max - min) + min));
  }

  return randomArray;
}

function fetchEm(numArray) {
  // Fetch each pokemon from numArray and call createCard() on it
  numArray.forEach((num) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
      .then((response) => response.json())
      .then((data) => createCard(data));
  });
}

function createCard(pokemonObj) {
  // create card container
  let newCard = document.createElement("div");
  newCard.className = "card";

  // add name
  let pokeName = document.createElement("h3");
  pokeName.className = "card-header";
  pokeName.textContent = pokemonObj.name;
  newCard.appendChild(pokeName);

  // add image
  let pokePic = document.createElement("img");
  pokePic.className = "card-img-top";
  pokePic.src = `${pokemonObj.sprites.other["official-artwork"].front_default}`;
  newCard.appendChild(pokePic);

  // create card body
  let cardBody = document.createElement("div");
  cardBody.className = "card-body";
  newCard.appendChild(cardBody);

  // add number
  let pokeNum = document.createElement("p");
  pokeNum.className = "card-subtitle";
  pokeNum.textContent = `#${pokemonObj.order}`;
  cardBody.appendChild(pokeNum);

  // add card text
  let cardText = document.createElement("p");
  cardText.className = "card-text";
  cardText.textContent = "lorum ipsum de facto oh hai";
  cardBody.appendChild(cardText);

  // create list container
  let statsContainer = document.createElement("ul");
  statsContainer.className = "list-group list-group-flush";
  newCard.appendChild(statsContainer);

  // add type
  let pokeType = document.createElement("li");
  pokeType.className = "list-group-item";
  let typeArray = [];
  pokemonObj.types.forEach((obj) => typeArray.push(obj.type.name));
  pokeType.textContent = `${typeArray.join(" / ")}`;
  statsContainer.appendChild(pokeType);

  // add height
  let pokeHeight = document.createElement("p");
  pokeHeight.className = "list-group-item";
  pokeHeight.textContent = `Height: ${pokemonObj.height} decimeters`;
  statsContainer.appendChild(pokeHeight);

  // add weight
  let pokeWeight = document.createElement("p");
  pokeWeight.className = "list-group-item";
  pokeWeight.textContent = `Weight: ${pokemonObj.weight} hectograms`;
  statsContainer.appendChild(pokeWeight);

  document.querySelector("#pokeball").appendChild(newCard);
}

