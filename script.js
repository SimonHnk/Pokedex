let currentPokemon;
let loadPkmLimit = 20;
let offset = 1;
let pokemonNames = [];
let pokemonIds = [];
let pokemonArray = [];
let backgroundSound = new Audio('./assets/sounds/rpg-town-loop.mp3');


function init() {
    loadPokemonArray();
}


async function loadPokemonArray() {
    for (let i = offset; i <= loadPkmLimit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        currentPokemon = await response.json();
        console.log(currentPokemon);
        pokemonArray.push(currentPokemon);

        saveForSearch();  
        renderPokemon(i);      
    }
}


function renderPokemon(i) {
    document.getElementById('pokemonIndex').innerHTML += `
            <div id="pokemonCard${i}" onmouseover="tiltShake(${i})" onmouseout="tiltShakeOff(${i})" class="card pokemon-card ${currentPokemon['types'][0]['type']['name']}">
                <div class="card-body">
                <div class="card-headline-container">
                    <h4 id="pokemonName" class="card-title title-color title-font mb-3">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h4>
                    <h5>#${currentPokemon['id']}</h5>
                    </div>
                    <div class="pokemon-min-info">
                        <div id="pokemonType${i}" class="pokemon-min-info-type">
                            
                        </div>
                        <img id="pokemonImg${i}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${i}.png" class="img-fluid pokemon-img" alt="Pokemon">
                    </div>
                </div>
                <img src="./assets/img/pokeball.png" class="img-fluid bg-pokeball" alt="Pokeball">
            </div>
    `;

    insertType(i);
}


function insertType(i) {
    for (let t = 0; t < currentPokemon['types'].length; t++) {
        let type = currentPokemon['types'][t];

        document.getElementById(`pokemonType${i}`).innerHTML += `
            <div class="pokemon-min-type">${type['type']['name'].charAt(0).toUpperCase() + type['type']['name'].slice(1)}</div>
        `;
    }
}


function saveForSearch() {
    pokemonNames.push(currentPokemon['name']);
    pokemonIds.push(currentPokemon['id']);
}


function tiltShake(j) {
    document.getElementById(`pokemonImg${j}`).classList.add('tilt-shake');
}


function tiltShakeOff(j) {
    document.getElementById(`pokemonImg${j}`).classList.remove('tilt-shake');
}


function loadMorePokemon() {
    offset = offset + 20;
    loadPkmLimit = loadPkmLimit + 20;

    loadPokemonArray();
}


function searchPokemon() {
    let searchQuerry = document.getElementById('searchInput').value
    let match = searchQuerry.match(/\d+/);

    if (match) {
        for (let sId = 0; sId < pokemonIds.length; sId++) {
            let id = +match[0];
            let index = pokemonIds.indexOf(id);

            if (index + 1 == sId + 1) {
                document.getElementById(`pokemonCard${sId + 1}`).style.display = 'block';
            } else {
                document.getElementById(`pokemonCard${sId + 1}`).style.display = 'none';
            }
        }
    } else {
        for (let sName = 0; sName < pokemonNames.length; sName++) {
            let pokeName = pokemonNames[sName];

            if (pokeName.includes(searchQuerry.trim().toLowerCase())) {
                document.getElementById(`pokemonCard${sName + 1}`).style.display = 'block';
            } else {
                document.getElementById(`pokemonCard${sName + 1}`).style.display = 'none';
            }
        }
    }
}


function playMusic() {
    backgroundSound.play();
}


function offMusic() {
    backgroundSound.pause();
}