init();


function init() {
    loadPokemonArray();
    loadFavPokemons();
    favPokemonCount();
    loadExternalSearch();
    proofCheckbox();
}


async function loadPokemonArray() {
    loadMoreButtonOff();
    favPokemonButtonOff();
    loadingSpinner();
    for (let i = offset; i <= loadPkmLimit; i++) {
        let url = `https://pokeapi.co/api/v2/pokemon/${i}`;
        let response = await fetch(url);
        let currentPokemon = await response.json();
        pokemonArray.push(currentPokemon);
        saveForSearch(currentPokemon);
    }
    await renderPokemon();
    loadingSpinner();
    favPokemonButtonOn();
    loadMoreButtonOn();
}


function renderPokemon() {
    for (let j = renderOffset; j < pokemonArray.length; j++) {
        let pokemon = pokemonArray[j];
        let id = j + 1;
        let typeContainer = 'pokemonType';
        document.getElementById('pokemonIndex').innerHTML += insertPokemonCardHTML(j, id, pokemon, typeContainer);
        insertType(id, pokemon, typeContainer);
    }
}


function insertType(id, pokemon, typeContainer) {
    for (let t = 0; t < pokemon['types'].length; t++) {
        let type = pokemon['types'][t];
        document.getElementById(`${typeContainer}${id}`).innerHTML += insertTypeHTML(type);
    }
}


function insertAbility(pokemon) {
    for (let a = 0; a < pokemon['abilities'].length; a++) {
        let ability = pokemon['abilities'][a];
        document.getElementById('abilityContainer').innerHTML += insertAbilityHTML(ability, a, pokemon);
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


function favPokemonButtonOff() {
    document.getElementById('favPokemonButton').onclick = null;
    document.getElementById('favPokemonButton').classList.add('greyscale');
}


function favPokemonButtonOn() {
    document.getElementById('favPokemonButton').onclick = () => { openFavPokemons(); };
    document.getElementById('favPokemonButton').classList.remove('greyscale');
}


function loadMoreButtonOff() {
    document.getElementById('loadMoreButtonClick').onclick = null;
}


function loadMoreButtonOn() {
    document.getElementById('loadMoreButtonClick').onclick = () => { loadMorePokemon(); };
}


function loadingSpinnerPokeCardOff() {
    document.getElementById('loadingSpinnerPokeCard').classList.add('hide');
}


function loadingSpinnerPokeCardOn() {
    document.getElementById('loadingSpinnerPokeCard').classList.remove('hide');
}


function loadMorePokemon() {
    offset = offset + 20;
    loadPkmLimit = loadPkmLimit + 20;
    renderOffset = renderOffset + 20;
    loadPokemonArray();
}


async function loadExternalSearch() {
    let url = 'https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0';
    let response = await fetch(url);
    let externalSearch = await response.json();
    externalSearchArray.push(externalSearch['results']);
}


function searchPokemon() {
    let searchQuerry = document.getElementById('searchInput').value
    let match = searchQuerry.match(/\d+/);
    if (!searchQuerry) {
        document.getElementById('loadMoreButton').style.display = 'flex';
    } else {
        document.getElementById('loadMoreButton').style.display = 'none';
    }
    tryExternalSearch(match, searchQuerry);
}


function proofCheckbox() {
    if (localStorage.getItem('checkbox')) {
        checkbox = JSON.parse(localStorage.getItem('checkbox'));
    }
    document.getElementById('checkbox').checked = checkbox;
    if (!checkbox) {
        document.getElementById('searchInput').addEventListener('keyup', searchPokemon);
    } else {
        document.getElementById('searchInput').removeEventListener('keyup', searchPokemon);
    }
}

function externalSearchToggle() {
    checkbox = !checkbox;
    localStorage.setItem('checkbox', JSON.stringify(checkbox));
    if (!checkbox) {
        window.location.replace('./index.html');
        document.getElementById('searchInput').addEventListener('keyup', searchPokemon);
    } else {
        document.getElementById('searchInput').removeEventListener('keyup', searchPokemon);
    }
}


function tryExternalSearch(match, searchQuerry) {
    if (!searchQuerry) {
        window.location.replace('./index.html');
    }
    if (checkbox && searchQuerry > 0) {
        document.getElementById('pokemonIndex').innerHTML = '';
        if (match) {
            searchIdNumberExternal(match);
        } else {
            searchNameExternal(searchQuerry);
        }
        return true;
    }
    if (match) {
        searchIdNumber(match);
    } else {
        searchName(searchQuerry);
    }
}


async function searchIdNumberExternal(match) {
    document.getElementById('searchInput').disabled = true;
    let searchId = match.toString();
    for (let ext_pkm = 1; ext_pkm < 1025; ext_pkm++) {
        let pkmId = ext_pkm.toString();
        let url = externalSearchArray[0][ext_pkm - 1]['url'];
        if (pkmId.includes(searchId)) {
            let response = await fetch(url);
            let externalPkm = await response.json();
            externalPokemonArray = externalPkm;
            console.log(externalPkm);
            await renderExternalPokemons();
        }
    }
    document.getElementById('searchInput').disabled = false;
}


function searchNameExternal(searchQuerry) {
    for (let ext_pkm = 0; ext_pkm < externalSearchArray[0].length; ext_pkm++) {
        let pkmName = externalSearchArray[0][ext_pkm]['name'];
        if (pkmName.includes(searchQuerry.trim().toLowerCase())) {
            console.log('Ja');
        }
        
    }
}


function renderExternalPokemons() {
        let id = externalPokemonArray['id'];
        let j = id - 1;
        let typeContainer = 'pokemonType';
        document.getElementById('pokemonIndex').innerHTML += insertPokemonCardHTML(j, id, externalPokemonArray, typeContainer);
        insertType(id, externalPokemonArray, typeContainer);
}


function searchIdNumber(match) {
    for (let sId = 0; sId < pokemonIds.length; sId++) {
        let id = +match[0];
        let index = pokemonIds.indexOf(id);
        if (index + 1 == sId + 1) {
            document.getElementById(`pokemonCard${sId + 1}`).style.display = 'block';
        } else {
            document.getElementById(`pokemonCard${sId + 1}`).style.display = 'none';
        }
    }
}


function searchName(searchQuerry) {
    for (let sName = 0; sName < pokemonNames.length; sName++) {
        let pokeName = pokemonNames[sName];
        if (pokeName.includes(searchQuerry.trim().toLowerCase())) {
            document.getElementById(`pokemonCard${sName + 1}`).style.display = 'block';
        } else {
            document.getElementById(`pokemonCard${sName + 1}`).style.display = 'none';
        }
    }
}


async function openPokeCard(j) {
    let card = document.getElementById('pokemonInfoCard');
    let pokemon = pokemonArray[j];
    let id = j + 1;
    let typeContainer = 'cardPokemonType';
    loadingSpinnerPokeCardOn();
    await loadSinglePokemonInformation(id);
    saveEvolutionChainPokemons();
    loadingSpinnerPokeCardOff();
    card.innerHTML = insertOpenPokeCardHTML(j, id, pokemon, typeContainer);
    insertType(id, pokemon, typeContainer);
    insertAbility(pokemon);
}


function stopPropagation(event) {
    event.stopPropagation();
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
    document.getElementById('pokemon-info-container').innerHTML = insertAboutTabHTML(pokemon);
    insertAbility(pokemon);
}


function statsTab(j) {
    colorOffSelectedTab();
    document.getElementById('statsTab').style = 'color: #46D1B1;';
    let pokemon = pokemonArray[j]['stats']
    let total = pokemon[0]['base_stat'] + pokemon[1]['base_stat'] + pokemon[2]['base_stat'] + pokemon[3]['base_stat'] + pokemon[4]['base_stat'] + pokemon[5]['base_stat']
    document.getElementById('pokemon-info-container').innerHTML = insertStatsTabHTML(pokemon, total);
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
    document.getElementById('pokemon-info-container').innerHTML = insertEvolutionTabFrameHTML();
    for (let ev_pokms = 0; ev_pokms < pokemonEvolutionChainPokemons.length; ev_pokms++) {
        let ev_pokm = pokemonEvolutionChainPokemons[ev_pokms];
        let ev_pokmSprite = ev_pokm['sprites']['other']['official-artwork']['front_default'];
        let ev_pokmCard = ev_pokm['id'] - 1;
        document.getElementById('pokemonEvolutionContainer').innerHTML += insertEvolutionTabHTML(ev_pokmCard, ev_pokmSprite, ev_pokms, pokemonEvolutionChainPokemons);
    }
}


function movesTab(j) {
    colorOffSelectedTab();
    document.getElementById('movesTab').style = 'color: #46D1B1;';
    let pokemonMoves = pokemonArray[j]['moves'];
    document.getElementById('pokemon-info-container').innerHTML = insertMovesTabFrameHTML();
    for (let m = 0; m < pokemonMoves.length; m++) {
        let moves = pokemonMoves[m]['move']['name'];
        document.getElementById('movesContainer').innerHTML += insertMovesTabHTML(moves, m, pokemonMoves);
    }
}


async function loadSinglePokemonInformation(id) {
    await loadPokemonSpecies(id);
    await loadPokemonEvolution();
    savePokemonEvolutionName();
}


async function loadPokemonSpecies(id) {
    let speciesLink = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`)
    let species = await speciesLink.json();
    pokemonSpecies = [];
    await pokemonSpecies.push(species);
}


async function loadPokemonEvolution() {
    let evolutionUrl = pokemonSpecies[0]['evolution_chain']['url'];
    let evolutionLink = await fetch(evolutionUrl);
    let evolution = await evolutionLink.json();
    pokemonEvolution = [];
    await pokemonEvolution.push(evolution);
}

function savePokemonEvolutionName() {
    pokemonEvolutionName = [];
    pokemonEvolutionName.push(pokemonEvolution[0]['chain']['species']['name'])
    let evolves_to = pokemonEvolution[0]['chain']['evolves_to'];
    while (evolves_to.length > 0) {
        pokemonEvolutionName.push(evolves_to[0]['species']['name']);
        evolves_to = evolves_to[0]['evolves_to'];
    }
}

async function saveEvolutionChainPokemons() {
    pokemonEvolutionChainPokemons = [];

    for (let ev_pokms = 0; ev_pokms < pokemonEvolutionName.length; ev_pokms++) {
        let ev_pokm = pokemonEvolutionName[ev_pokms];
        let ev_pokmLink = await fetch(`https://pokeapi.co/api/v2/pokemon/${ev_pokm}`);
        let ev_pokmJson = await ev_pokmLink.json();
        pokemonEvolutionChainPokemons.push(ev_pokmJson);
    }
}


document.getElementById('playBtn').addEventListener('click', function playMusic() { backgroundSound.play(); });


document.getElementById('pauseBtn').addEventListener('click', function offMusic() { backgroundSound.pause(); });