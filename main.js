// Execution Flow
//----------------//
// Generate random pokemon
// each pokemon has a catch button
// catch button randomly decides if your throw is successful
// if successful the pokemon is added to your collection
// if not, new pokemon is generated

getAPokemon();

function getAPokemon() {
  fetchEm(randomNumGen(1, 151));
}

function clearWildPokemon() {
  // clears current wild pokemon and returns its card
  const currentPokemon = document.querySelector("#wildPokemonContainer");
  const pokeCard = currentPokemon.firstChild;
  console.log(currentPokemon);
  currentPokemon.removeChild(currentPokemon.firstChild);
  return pokeCard;
}

function moveCardToPokedex(card){
  console.log(card);
  const pokedex = document.querySelector("#pokedexDisplay");
  card.className = "card caught";
  let cardText = card.textContent.split(" ");
  card.firstChild.textContent = cardText[2];
  card.removeChild(card.lastChild);
  let deleteBtn = document.createElement("button");
  deleteBtn.textContent = "remove";
  deleteBtn.addEventListener("click", (e) => {
    e.target.parentElement(remove());
  })
  pokedex.appendChild(card);
}

function capitalizeName(name) {
  return name[0].toUpperCase() + name.slice(1);
}

function randomNumGen(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

function fetchEm(randomNum) {
  // Fetch a pokemon from passed in random num and call createCard() on it
  fetch(`https://pokeapi.co/api/v2/pokemon/${randomNum}`)
    .then((response) => response.json())
    .then((data) => pokeObjHandler(data))
    .then((newPokemon) => {
      createPokemonCard(newPokemon, "wildPokemon");
      //sendDataToServer(newPokemon, "wildPokemon");
    });
}

function createPokemonCard(pokemonObj, typeOfCard) {
  function cardContainer() {
    let newCard = document.createElement("div");
    newCard.className = "card";
    return newCard;
  }

  function cardHeader() {
    let pokeHeader = document.createElement("h3");
    pokeHeader.className = "card-header";

    switch (typeOfCard) {
      case "wildPokemon":
        pokeHeader.textContent = `A wild ${capitalizeName(
          pokemonObj.name
        )} has appeared!`;
        break;
      case "caughtPokemon":
        pokeHeader.textContent = capitalizeName(pokemonObj.name);
        break;
    }
    return pokeHeader;
  }

  function cardPic() {
    let pokePic = document.createElement("img");
    pokePic.className = "card-img-top";
    pokePic.src = `${pokemonObj.pic}`;
    return pokePic;
  }

  function cardBody() {
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    return cardBody;
  }

  function catchBtn() {
    let catchBtn = document.createElement("button");
    catchBtn.className = "btn btn-primary";
    catchBtn.textContent = "Throw a Pokeball!";
    catchBtn.addEventListener("click", () => {
      moveCardToPokedex(clearWildPokemon());
      getAPokemon();
    });
    return catchBtn;
  }

  function runBtn() {
    let runAwayBtn = document.createElement("button");
    runAwayBtn.className = "btn btn-primary";
    runAwayBtn.id = "runAway";
    runAwayBtn.textContent = "Run Away!";
    runAwayBtn.addEventListener("click", () => {
      clearWildPokemon();
      getAPokemon();
    });
    return runAwayBtn;
  }

  const newCardContainer = cardContainer();
  const newCardHeader = cardHeader();
  const newCardPic = cardPic();
  const newCardBody = cardBody();
  const newCatchBtn = catchBtn();
  const newRunBtn = runBtn();

  switch (typeOfCard) {
    case "wildPokemon":
      const wildPokemonContainer = document.querySelector(
        "#wildPokemonContainer"
      );

      newCardBody.appendChild(newCatchBtn);
      newCardBody.appendChild(newRunBtn);
      newCardContainer.appendChild(newCardHeader);
      newCardContainer.appendChild(newCardPic);
      newCardContainer.appendChild(newCardBody);
      wildPokemonContainer.appendChild(newCardContainer);
      break;

    case "caughtPokemon":
      const caughtPokemonContainer = document.querySelector(
        "#caughtPokemonContainer"
      );
      newCardContainer.appendChild(newCardHeader);
      newCardContainer.appendChild(newCardPic);
      caughtPokemonContainer.appendChild(newCardContainer);
      break;
  }
}

function pokeObjHandler(pokeObject) {
  // Saves relevant data retrieved from API
  let newPokemon = {
    name: pokeObject.name,
    pic: pokeObject.sprites.other["official-artwork"].front_default,
  };

  return newPokemon;
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
