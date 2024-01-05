let currentPokemon;


async function loadPokemon() {
    let url = 'https://pokeapi.co/api/v2/pokemon/bulbasaur';
    let response = await fetch(url);
    let responseAsJson = await response.json();
    currentPokemon = responseAsJson;
    console.log(currentPokemon);

    renderPokemonInfo();
}


function renderPokemonInfo() {
    document.getElementById('pokemonName').innerHTML = currentPokemon['name'].charAt(0).toUpperCase() + currentPokemon['name'].slice(1);
    document.getElementById('pokemonImg').src = currentPokemon['sprites']['other']['official-artwork']['front_default'];

}