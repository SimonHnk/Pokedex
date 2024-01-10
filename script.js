let loadPkmLimit = 20;
let offset = 1;
let renderOffset = 0;
let pokemonNames = [];
let pokemonIds = [];
let pokemonArray = [];
let backgroundSound = new Audio('./assets/sounds/rpg-town-loop.mp3');
let favPokemons = [];


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
        let typeContainer = 'pokemonType';

        document.getElementById('pokemonIndex').innerHTML += `
            <div onclick="openPokeCard(${j})" id="pokemonCard${id}" onmouseover="tiltShake(${id})" onmouseout="tiltShakeOff(${id})" class="card pokemon-card ${pokemon['types'][0]['type']['name']}">
                <div class="card-body">
                <div class="card-headline-container">
                    <h4 id="pokemonName" class="card-title title-color title-font mb-3">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h4>
                    <h5>#${insertId(id)}</h5>
                    </div>
                    <div class="pokemon-min-info">
                        <div id="${typeContainer}${id}" class="pokemon-min-info-type">
                            
                        </div>
                        <img id="pokemonImg${id}" src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png" class="img-fluid pokemon-img" alt="Pokemon">
                    </div>
                </div>
                <img src="./assets/img/pokeball.png" class="img-fluid bg-pokeball" alt="Pokeball">
            </div>
    `;

        insertType(id, pokemon, typeContainer);
    }
}


function insertType(id, pokemon, typeContainer) {
    for (let t = 0; t < pokemon['types'].length; t++) {
        let type = pokemon['types'][t];

        document.getElementById(`${typeContainer}${id}`).innerHTML += `
            <div class="pokemon-min-type">${type['type']['name'].charAt(0).toUpperCase() + type['type']['name'].slice(1)}</div>
        `;
    }
}


function insertId(id) {
    if (id.toString().length == 1) {
        return `00${id}`;
    }
    if (id.toString().length == 2) {
        return `0${id}`;
    }
    if (id.toString().length == 3) {
        return `${id}`;
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
    let id = j + 1;
    let typeContainer = 'cardPokemonType';
    console.log(pokemon);

    card.innerHTML = `
    <div class="pokemon-info-card-background">
    <div class="card pokemon-info-card ${pokemon['types'][0]['type']['name']}">
        <img class="img-fluid bg-info-card-pokeball" src="./assets/img/pokeball.png" alt="Pokeball">
        <div class="pokemon-info-card-top">
            <div style="padding-left: 20px; padding-right: 20px;">
                <div class="headline-nav">
                    <img onclick="exitPokeCard()" class="back-arrow" src="./assets/img/back-arrow.png" alt="">
                    <img id="favPokemon${id}" onclick="saveToFav(${id})" class="fav-pokeball" src="./assets/img/pokeball.png" alt="">
                </div>
                <div class="pokemon-img-info-card-headline-container">
                    <div>
                        <h4 class="card-title title-color title-font">${pokemon['name'].charAt(0).toUpperCase() + pokemon['name'].slice(1)}</h4>
                        <div class="pokemon-min-info">
                            <div id="${typeContainer}${id}" class="pokemon-info-card-type">
                                
                            </div>
                        </div>
                    </div>
                    <h5>#${insertId(id)}</h5>
                </div>
                <div class="info-img-container">
                    <img class="pokemon-img-info-card"
                        src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png"
                        alt="Pokemon">
                </div>
            </div>
            <div class="card pokemon-info-card-bottom">

            </div>
        </div>
    </div>
</div>
    `;

    insertType(id, pokemon, typeContainer)
}


function exitPokeCard() {
    let card = document.getElementById('pokemonInfoCard');

    card.innerHTML = '';
}


function saveToFav(id) {
    let pokeball = document.getElementById(`favPokemon${id}`).getAttribute('src');
    let pokeSrc = document.getElementById(`favPokemon${id}`);

    if (pokeball == './assets/img/pokeball.png') {
        pokeSrc.src = './assets/img/pokeball-fav.png';
    } else {
        pokeSrc.src = './assets/img/pokeball.png';
    }
}


document.getElementById('playBtn').addEventListener('click', function playMusic() { backgroundSound.play(); });


document.getElementById('pauseBtn').addEventListener('click', function offMusic() { backgroundSound.pause(); });