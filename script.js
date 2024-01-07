let loadPkmLimit = 20;
let offset = 1;
let renderOffset = 0;
let pokemonNames = [];
let pokemonIds = [];
let pokemonArray = [];
let backgroundSound = new Audio('./assets/sounds/rpg-town-loop.mp3');


function init() {
    loadPokemonArray();
}


async function loadPokemonArray() {
    loadingSpinner();

    for (let i = offset; i <= loadPkmLimit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        console.log(currentPokemon);
        pokemonArray.push(currentPokemon);

        saveForSearch(currentPokemon);
    }
    await renderPokemon();
    loadingSpinner();
}


function renderPokemon() {
    for (let j = renderOffset; j < pokemonArray.length; j++) {
        let pokemon = pokemonArray[j];
        let id = j + 1;

        document.getElementById('pokemonIndex').innerHTML += `
            <div onclick="openPokeCard(${j})" id="pokemonCard${id}" onmouseover="tiltShake(${id})" onmouseout="tiltShakeOff(${id})" class="card pokemon-card ${pokemon['types'][0]['type']['name']}">
                <div class="card-body">
                <div class="card-headline-container">
                    <h4 id="pokemonName" class="card-title title-color title-font mb-3">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h4>
                    <h5>#${pokemon['id']}</h5>
                    </div>
                    <div class="pokemon-min-info">
                        <div id="pokemonType${id}" class="pokemon-min-info-type">
                            
                        </div>
                        <img id="pokemonImg${id}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" class="img-fluid pokemon-img" alt="Pokemon">
                    </div>
                </div>
                <img src="./assets/img/pokeball.png" class="img-fluid bg-pokeball" alt="Pokeball">
            </div>
    `;

        insertType(id, pokemon);
    }
}


function insertType(id, pokemon) {
    for (let t = 0; t < pokemon['types'].length; t++) {
        let type = pokemon['types'][t];

        document.getElementById(`pokemonType${id}`).innerHTML += `
            <div class="pokemon-min-type">${type['type']['name'].charAt(0).toUpperCase() + type['type']['name'].slice(1)}</div>
        `;
    }
}


function saveForSearch(currentPokemon) {
    pokemonNames.push(currentPokemon['name']);
    pokemonIds.push(currentPokemon['id']);
}


function tiltShake(id) {
    document.getElementById(`pokemonImg${id}`).classList.add('tilt-shake');
}


function tiltShakeOff(id) {
    document.getElementById(`pokemonImg${id}`).classList.remove('tilt-shake');
}


function loadingSpinner() {
    document.getElementById('loadingSpinner').classList.toggle('hide');
}


function loadMorePokemon() {
    offset = offset + 20;
    loadPkmLimit = loadPkmLimit + 20;
    renderOffset = renderOffset + 20;

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


function openPokeCard(j) {
    let card = document.getElementById('pokemonInfoCard');
    let pokemon = pokemonArray[j];
    console.log(pokemon);
}


document.getElementById('playBtn').addEventListener('click', function playMusic() {backgroundSound.play();});


document.getElementById('pauseBtn').addEventListener('click', function offMusic() {backgroundSound.pause();});