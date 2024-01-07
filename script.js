let currentPokemon;
let offset = 0;
let renderArrayLength = 20;
let renderStart = 1;
let pokemonNames = [];
let pokemonIds = [];


async function loadPokemonArray() {
    let url = `https://pokeapi.co/api/v2/pokemon/?limit=20&offset=${offset}`;
    let response = await fetch(url);
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    getPokemonUrl(responseAsJson);
}


async function getPokemonUrl(responseAsJson) {
    for (let i = 0, j = renderStart; i < responseAsJson['results'].length, renderArrayLength; i++, j++) {
        let pokemon = responseAsJson['results'][i];
        let pokemonUrl = await pokemon['url'];

        loadSinglePokemon(pokemonUrl, j);
    }
}


async function loadSinglePokemon(pokemonUrl, j) {
    let responsePokemon = await fetch(pokemonUrl);
    currentPokemon = await responsePokemon.json();
    console.log(currentPokemon);

    saveForSearch();
    renderPokemon(j);
}


function renderPokemon(j) {
    document.getElementById('pokemonIndex').innerHTML += `
            <div id="pokemonCard${j}" onmouseover="tiltShake(${j})" onmouseout="tiltShakeOff(${j})" class="card pokemon-card ${currentPokemon['types'][0]['type']['name']}">
                <div class="card-body">
                    <h4 id="pokemonName" class="card-title title-color title-font mb-3">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h4>
                    <div class="pokemon-min-info">
                        <div id="pokemonType${j}" class="pokemon-min-info-type">
                            
                        </div>
                        <img id="pokemonImg${j}" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" class="img-fluid pokemon-img" alt="Pokemon">
                    </div>
                </div>
                <img src="./assets/img/pokeball.png" class="img-fluid bg-pokeball" alt="Pokeball">
            </div>
    `;

    insertType(j);
}


function insertType(j) {
    for (let t = 0; t < currentPokemon['types'].length; t++) {
        let type = currentPokemon['types'][t];

        document.getElementById(`pokemonType${j}`).innerHTML += `
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
    renderArrayLength = renderArrayLength + 20;
    renderStart = renderStart + 20;

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