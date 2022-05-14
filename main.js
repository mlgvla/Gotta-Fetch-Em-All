function randomNumGen(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function catchEm(int) {
  // Returns array of ${int} Pokemon objects
  const rngResults = [];
  const gotcha = [];

  for (let i = 0; i < int; i++) {
    rngResults.push(randomNumGen(1, 151));
  }

  rngResults.forEach((num) => {
    fetch(`https://pokeapi.co/api/v2/pokemon/${num}`)
      .then((response) => response.json())
      .then((data) => gotcha.push(data))
      .catch((error) => console.log("Server error!"));
  });

  return gotcha;
}

function showEmOff(pokeArray) {
  pokeArray.forEach((pokemon) => {
    let card = createCard(pokemon);
    document.querySelector("#pokeball").appendChild(card);
  });
}

function capitalizeWord(word) {
  const capitalizedWord = word[0].toUpperCase() + word.slice(1);
  return capitalizedWord;
}

function createCard(pokemonObj) {
  // create card container
  let newCard = document.createElement("div");
  newCard.className = "pokeCard";

  // add name
  let pokeName = document.createElement("h3");
  pokeName.textContent = pokemonObj.name;
  newCard.appendChild(pokeName);

  // add number
  let pokeNum = document.createElement("p");
  pokeNum.className = "pokeNumber";
  pokeNum.textContent = `#${pokemonObj.order}`;
  newCard.appendChild(pokeNum);

  // add image
  let pokePic = document.createElement("img");
  pokePic.className = "pokePic";
  pokePic.src = `${pokemonObj.sprites.other["official-artwork"].front_default}`;
  newCard.appendChild(pokePic);

  // add type
  let pokeType = document.createElement("p");
  let typeArray = [];
  pokemonObj.types.forEach((obj) => typeArray.push(obj.type.name));
  pokeType.textContent = `${typeArray.join(" / ")}`;
  newCard.appendChild(pokeType);

  // add height
  let pokeHeight = document.createElement("p");
  pokeHeight.textContent = `Height: ${pokemonObj.height} decimeters`;
  newCard.appendChild(pokeHeight);

  // add weight
  let pokeWeight = document.createElement("p");
  pokeWeight.textContent = `Weight: ${pokemonObj.weight} hectograms`;
  newCard.appendChild(pokeWeight);

  return newCard;
}

// Test code pls ignore
let mahPokes = catchEm(6);
showEmOff(mahPokes);