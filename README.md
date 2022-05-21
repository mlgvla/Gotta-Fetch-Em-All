# Gotta Fetch 'Em All!
**A JavaScript learning project**

Gotta Fetch 'Em All is a web application that utilizes HTML, CSS, JavaScript, and json-server to demonstrate the lessons taught in Phase 1 of Flatiron School's Software Development Bootcamp. The app utilizes the PokeAPI (https://pokeapi.co/?ref=public-apis) for individual pokemon data, and allows the user to encounter random Pokemon and attempt to catch them to add them to their personal Pokedex. Once they've caught a Pokemon, a user may give that Pokemon a name, or release them back into the wild to free up space in their bag. The application stores the user's Pokedex as JSON data, allowing the Pokedex to persist through page reloads. This project utilizes Bootstrap (https://getbootstrap.com/) for the base CSS formatting. 

Initial user goals:
<ul>
<li>See a random Pokemon pulled from the PokeAPI</li>
<li>Interact with said wild Pokemon by choosing to attempt to catch them, or by running away and having a new random Pokemon pulled and displayed</li>
<li>Collect Pokemon in a basic implementation of a Pokedex</li>
<li>Rename any Pokemon in the Pokedex</li>
<li>Release any caught Pokemon</li>
<li>Maintain their collection through page refreshes</li>
</ul>

Planned features:
<ul>
<li>Deployment to remove dependency on local server</li>
<li>Adding an Experience tracker that affects a user's chance to catch a Pokemon, dependent on how many Pokemon a user has seen and caught previously</li>
<li>Implementing a more detailed model for the Pokedex, namely by allowing users to track how many different types of Pokemon they've seen, deep dive into the stats of their current Pokemon, sort Pokemon by type, and displaying their progress toward c̶a̶t̶c̶h̶i̶n̶g̶ fetching them all!</li>
<li>Offering multiple user profiles, allowing multiple users' statistics to be tracked simultaneously</li>
</ul>

Useage:
Clone the repository to your local environment, and then run ```npm install``` to install the project's dependencies. Once installed, run ```npm run dev``` to start the local server. Open the index.html page in any modern browser, and go catch some Pokemon!
