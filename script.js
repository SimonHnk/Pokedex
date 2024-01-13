let loadPkmLimit = 20;
let offset = 1;
let renderOffset = 0;
let pokemonNames = [];
let pokemonIds = [];
let pokemonArray = [];
let pokemonSpecies = [];
let pokemonEvolution = [];
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


function insertAbility(pokemon) {
    for (let a = 0; a < pokemon['abilities'].length; a++) {
        let ability = pokemon['abilities'][a];

        document.getElementById('abilityContainer').innerHTML += `
        ${ability['ability']['name'].charAt(0).toUpperCase() + ability['ability']['name'].slice(1)}
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


async function openPokeCard(j) {
    let card = document.getElementById('pokemonInfoCard');
    let pokemon = pokemonArray[j];
    let id = j + 1;
    let typeContainer = 'cardPokemonType';

    card.innerHTML = `
    <div class="pokemon-info-card-background">
        <div class="text-center">
            <div class="spinner-border white" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `;

    await loadSinglePokemonInformation(id);

    card.innerHTML = `
    <div class="pokemon-info-card-background">
        ${lastPokemon(j)}
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
                    <table class="nav-table">
                        <tr>
                            <td><span id="aboutTab" onclick="aboutTab(${j})" style="color: #46D1B1;">About</span></td>
                            <td><span id="statsTab" onclick="statsTab(${j})">Base Stats</span></td>
                            <td><span id="evolutionTab" onclick="evolutionTab()">Evolution</span></td>
                            <td><span id="movesTab" onclick="movesTab(${j})">Moves</span></td>
                        </tr>
                    </table>
                    <div id="pokemon-info-container">
                        <table class="about-table">
                            <tr>
                                <td>Species</td>
                                <td>${pokemonSpecies[0]['genera'][7]['genus']}</td>
                            </tr>
                            <tr>
                                <td>Height</td>
                                <td>${parseFloat(pokemon['height'] / 10).toFixed(2).replace('.', ',')} m</td>
                            </tr>
                            <tr>
                                <td>Weight</td>
                                <td>${parseFloat(pokemon['weight'] / 10).toFixed(2).replace('.', ',')} kg</td>
                            </tr>
                            <tr>
                                <td>Abilities</td>
                                <td id="abilityContainer">

                                </td>
                            </tr>
                        </table>
                        <div class="breed-headline">Breeding</div>
                        <table class="breeding-table">
                            <tr>
                                <td>Gender</td>
                                <td class="aling-items">
                                    <img class="male-icon" src="./assets/img/male-icon.png" alt="Male-Symbol">  
                                    ${parseFloat(100 - pokemonSpecies[0]['gender_rate'] / 0.08).toFixed(2)}%                                    
                                </td>
                                <td>
                                    <img class="female-icon" src="./assets/img/female-icon.png" alt="Female-Symbol">                                    
                                    ${parseFloat(pokemonSpecies[0]['gender_rate'] / 0.08).toFixed(2)}%
                                </td>
                            </tr>
                            <tr>
                                <td>Egg Group</td>
                                <td>${pokemonSpecies[0]['egg_groups'][0]['name'].charAt(0).toUpperCase() + pokemonSpecies[0]['egg_groups'][0]['name'].slice(1)}</td>
                            </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        ${nextPokemonArrow(j)}
    </div>
    `;

    insertType(id, pokemon, typeContainer);
    insertAbility(pokemon);
}


function exitPokeCard() {
    let card = document.getElementById('pokemonInfoCard');

    card.innerHTML = '';
}


function colorOffSelectedTab() {
    document.getElementById('aboutTab').style = 'color: unset;';
    document.getElementById('statsTab').style = 'color: unset;';
    document.getElementById('evolutionTab').style = 'color: unset;';
    document.getElementById('movesTab').style = 'color: unset;';
}


function aboutTab(j) {
    colorOffSelectedTab();
    document.getElementById('aboutTab').style = 'color: #46D1B1;';

    let pokemon = pokemonArray[j]

    document.getElementById('pokemon-info-container').innerHTML = `
        <table class="about-table">
            <tr>
                <td>Species</td>
                <td>${pokemonSpecies[0]['genera'][7]['genus']}</td>
            </tr>
            <tr>
            <td>Height</td>
                <td>${parseFloat(pokemon['height'] / 10).toFixed(2).replace('.', ',')} m</td>
            </tr>
            <tr>
                <td>Weight</td>
                <td>${parseFloat(pokemon['weight'] / 10).toFixed(2).replace('.', ',')} kg</td>
            </tr>
            <tr>
                <td>Abilities</td>
                <td id="abilityContainer">

                </td>
            </tr>
        </table>
        <div class="breed-headline">Breeding</div>
        <table class="breeding-table">
            <tr>
                <td>Gender</td>
                <td class="aling-items">
                    <img class="male-icon" src="./assets/img/male-icon.png" alt="Male-Symbol">  
                    ${parseFloat(100 - pokemonSpecies[0]['gender_rate'] / 0.08).toFixed(2)}%                                    
                </td>
                <td>
                    <img class="female-icon" src="./assets/img/female-icon.png" alt="Female-Symbol">                                    
                    ${parseFloat(pokemonSpecies[0]['gender_rate'] / 0.08).toFixed(2)}%
                </td>
            </tr>
            <tr>
                <td>Egg Group</td>
                <td>${pokemonSpecies[0]['egg_groups'][0]['name'].charAt(0).toUpperCase() + pokemonSpecies[0]['egg_groups'][0]['name'].slice(1)}</td>
            </tr>
        </table>
    `;

    insertAbility(pokemon);
}


function statsTab(j) {
    colorOffSelectedTab();
    document.getElementById('statsTab').style = 'color: #46D1B1;';

    let pokemon = pokemonArray[j]['stats']
    let total = pokemon[0]['base_stat'] + pokemon[1]['base_stat'] + pokemon[2]['base_stat'] + pokemon[3]['base_stat'] + pokemon[4]['base_stat'] + pokemon[5]['base_stat']

    document.getElementById('pokemon-info-container').innerHTML = `
    <div class="stat-container">
        <div class="stat-type-bar">
            <div class="stat-name-container">HP</div>
            <div class="stat-count-container">${pokemon[0]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="HP" aria-valuenow="${pokemon[0]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-danger" style="width: ${calcStatBar(pokemon[0]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Attack</div>
            <div class="stat-count-container">${pokemon[1]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Attack" aria-valuenow="${pokemon[1]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-success" style="width: ${calcStatBar(pokemon[1]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Defense</div>
            <div class="stat-count-container">${pokemon[2]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Defense" aria-valuenow="${pokemon[2]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-danger" style="width: ${calcStatBar(pokemon[2]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Sp. Attack</div>
            <div class="stat-count-container">${pokemon[3]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Sp. Attack" aria-valuenow="${pokemon[3]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-success" style="width: ${calcStatBar(pokemon[3]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Sp. Defense</div>
            <div class="stat-count-container">${pokemon[4]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Sp. Defense" aria-valuenow="${pokemon[4]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-success" style="width: ${calcStatBar(pokemon[4]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Speed</div>
            <div class="stat-count-container">${pokemon[5]['base_stat']}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Speed" aria-valuenow="${pokemon[5]['base_stat']}" aria-valuemin="0"
                    aria-valuemax="255">
                    <div class="progress-bar bg-danger" style="width: ${calcStatBar(pokemon[5]['base_stat'])}%"></div>
                </div>
            </div>
        </div>
        <div class="stat-type-bar">
            <div class="stat-name-container">Total</div>
            <div class="stat-count-container">${total}</div>
            <div class="stat-bar-container">
                <div class="progress progress-height" role="progressbar"
                    aria-label="Total" aria-valuenow="${total}" aria-valuemin="0"
                    aria-valuemax="1530">
                    <div class="progress-bar bg-success" style="width: ${calcStatBarTotal(total)}%"></div>
                </div>
            </div>
        </div>
    </div>
    `;
}


function calcStatBar(x) {
    let stat = x * 100 / 255;
    return stat.toFixed(2);
}

function calcStatBarTotal(t) {
    let toalBar = t * 100 / 1530;
    return toalBar.toFixed(2);
}


function evolutionTab() {
    colorOffSelectedTab();
    document.getElementById('evolutionTab').style = 'color: #46D1B1;';

    document.getElementById('pokemon-info-container').innerHTML = `
    
    `;
}


function movesTab(j) {
    colorOffSelectedTab();
    document.getElementById('movesTab').style = 'color: #46D1B1;';

    let pokemonMoves = pokemonArray[j]['moves'];

    document.getElementById('pokemon-info-container').innerHTML = '<div id="movesContainer" class="moves-container"></div>';

    for (let m = 0; m < pokemonMoves.length; m++) {
        let moves = pokemonMoves[m]['move']['name'];

        document.getElementById('movesContainer').innerHTML += `       
            <div class="move-single">${moves.charAt(0).toUpperCase() + moves.slice(1)},</div>      
        `;
        
    }
}


async function loadSinglePokemonInformation(id) {
    let speciesLink = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    let species = await speciesLink.json();
    pokemonSpecies = [];
    pokemonSpecies.push(species);
    console.log(species);

    let evolutionLink = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${id}`)
    let evolution = await evolutionLink.json();
    pokemonEvolution = [];
    pokemonEvolution.push(evolution);
    console.log(evolution);
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


function nextPokemonArrow(j) {
    if (j < pokemonArray.length - 1) {
        return `
        <div>
            <img onclick="openPokeCard(${j + 1})" class="next-arrow" src="./assets/img/arrow-right.png" alt="Arrow-Right">
        </div>
        `;
    }
    return `
        <div style="width: 40px;"></div>
        `;
}


function lastPokemon(j) {
    if (j > 0) {
        return `
        <div>
            <img onclick="openPokeCard(${j - 1})" class="next-arrow" src="./assets/img/arrow-left.png" alt="Arrow-Left">
        </div>
        `;
    }
    return `
        <div style="width: 40px;"></div>
        `;
}


document.getElementById('playBtn').addEventListener('click', function playMusic() { backgroundSound.play(); });


document.getElementById('pauseBtn').addEventListener('click', function offMusic() { backgroundSound.pause(); });