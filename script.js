init();


function init() {
    loadPokemonArray();
    loadFavPokemons();
    favPokemonCount();
}


async function loadPokemonArray() {
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
        searchIdNumber(match);
    } else {
        searchName(searchQuerry);
    }
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

    card.innerHTML = insertLoadingSpinnerHTML();

    await loadSinglePokemonInformation(id);
    saveEvolutionChainPokemons();

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


function saveToFav(id, j) {
    proofAlreadySaved(id, j);



    saveFavPokemons();
    favPokemonCount();
    openPokeCard(j);
}


function proofAlreadySaved(id, j) {
    for (let favPkm = 0; favPkm < favPokemons.length; favPkm++) {
        let favPokemon = favPokemons[favPkm];

        if (favPokemon['id'].includes(`${id}`)) {
            favPokemons.splice(favPkm, 1);
            return true;
        }
    }
    let favPokemonJson = {
        'pokemon': pokemonArray[j],
        'id': `${id}`,
    };

    favPokemons.push(favPokemonJson);
}


function saveFavPokemons() {
    localStorage.setItem('favPokemons', JSON.stringify(favPokemons));
}


function loadFavPokemons() {
    if (localStorage.getItem('favPokemons')) {
        favPokemons = JSON.parse(localStorage.getItem('favPokemons'));
    }
}


function returnFavImgSrc(id) {
    for (let favPkm = 0; favPkm < favPokemons.length; favPkm++) {
        let favPokemon = favPokemons[favPkm];

        if (favPokemon['id'].includes(`${id}`)) {
            return './assets/img/pokeball-fav.png';
        }
    }
    return './assets/img/pokeball.png';
}


function favPokemonCount() {
    if (favPokemons.length === 0) {
        document.getElementById('caughtPokemon').classList.add('hide');
    } else {
        document.getElementById('caughtPokemon').classList.remove('hide');
        document.getElementById('caughtPokemonCount').innerHTML = `
        ${favPokemons.length}
        `;
    }
}


document.getElementById('playBtn').addEventListener('click', function playMusic() { backgroundSound.play(); });


document.getElementById('pauseBtn').addEventListener('click', function offMusic() { backgroundSound.pause(); });