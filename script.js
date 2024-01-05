let currentPokemon;


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/?limit=20&offset=0';
    let response = await fetch(url);
    let responseAsJson = await response.json();
    console.log(responseAsJson);

    loadPokemonId(responseAsJson);
}


async function loadPokemonId(responseAsJson) {
    for (let i = 0; i < responseAsJson['results'].length; i++) {
        let pokemon = responseAsJson['results'][i];
        let pokemonId = pokemon['url'];
        console.log(pokemonId);

        await loadSinglePokemon(pokemonId, i);
    }
}


async function loadSinglePokemon(pokemonId, i) {
    let responsePokemon = await fetch(pokemonId);
    currentPokemon = await responsePokemon.json();
    console.log(currentPokemon);

    renderPokemon(i);
}


function renderPokemon(i) {
    document.getElementById('pokemonIndex').innerHTML += `
            <div id="pokemonCard${i}" onmouseover="tiltShake(${i})" onmouseout="tiltShakeOff(${i})" class="card pokemon-card ${currentPokemon['types'][0]['type']['name']}">
                <div class="card-body">
                    <h4 id="pokemonName" class="card-title title-color title-font mb-3">${currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1)}</h4>
                    <div class="pokemon-min-info">
                        <div id="pokemonType${i}" class="pokemon-min-info-type">
                            
                        </div>
                        <img id="pokemonImg${i}" src="${currentPokemon['sprites']['other']['official-artwork']['front_default']}" class="img-fluid pokemon-img" alt="Pokemon">
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


function tiltShake(i) {
    document.getElementById(`pokemonImg${i}`).classList.add('tilt-shake');
}


function tiltShakeOff(i) {
    document.getElementById(`pokemonImg${i}`).classList.remove('tilt-shake');
}