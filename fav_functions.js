function saveToFav(id, j) {
    proofAlreadySaved(id, j);
    saveFavPokemons();
    favPokemonCount();
    openPokeCard(j);
}


function proofAlreadySaved(id, j) {
    for (let favPkm = 0; favPkm < favPokemons.length; favPkm++) {
        let favPokemon = favPokemons[favPkm];

        if (favPokemon['id'] === id) {
            favPokemons.splice(favPkm, 1);
            return true;
        }
    }
    let favPokemonJson = {
        'pokemon': pokemonArray[j],
        'id': id,
    };
    favPokemons.push(favPokemonJson);
    favPokemons.sort((a, b) => a['id'] - b['id']);
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

        if (favPokemon['id'] === id) {
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


function openFavPokemons() {
    document.getElementById('loadMoreButton').classList.add('hide');
    favPokemonsEmpty();

    for (let fav = 0; fav < favPokemons.length; fav++) {
        let pokemon = favPokemons[fav]['pokemon'];
        let id = favPokemons[fav]['id'];
        let typeContainer = 'pokemonType';

        document.getElementById('pokemonIndex').innerHTML += insertFavPokemonCardHTML(fav, id, pokemon, typeContainer);

        insertType(id, pokemon, typeContainer);
    }
}


function favPokemonsEmpty() {
    if (favPokemons.length) {
        document.getElementById('pokemonIndex').innerHTML = '';
    } else {
        document.getElementById('pokemonIndex').innerHTML = favPokemonsEmptyHTML();
    }
}


async function openFavPokeCard(fav) {
    let card = document.getElementById('pokemonInfoCard');
    let pokemon = favPokemons[fav]['pokemon'];
    let id = favPokemons[fav]['id'];
    let typeContainer = 'cardPokemonType';

    loadingSpinnerPokeCardOn();

    await loadSinglePokemonInformation(id);
    saveEvolutionChainPokemons();

    loadingSpinnerPokeCardOff();
    card.innerHTML = insertOpenFavPokeCardHTML(fav, id, pokemon, typeContainer);

    insertType(id, pokemon, typeContainer);
    insertAbility(pokemon);
}


function saveToFavRendered(id, fav) {
    proofAlreadySaved(id, fav);
    saveFavPokemons();
    favPokemonCount();
    openFavPokemons();

    if (favPokemons.length === 0) {
        document.getElementById('pokemonInfoCard').innerHTML = '';
        return false;
    }
    if (fav === favPokemons.length) {
        openFavPokeCard(fav - 1);
        return true;
    }
    openFavPokeCard(fav);
}