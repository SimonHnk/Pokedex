function insertPokemonCardHTML(j, id, pokemon, typeContainer) {
    return `
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
}


function insertFavPokemonCardHTML(fav, id, pokemon, typeContainer) {
    return `
    <div onclick="openFavPokeCard(${fav})" id="pokemonCard${id}" onmouseover="tiltShake(${id})" onmouseout="tiltShakeOff(${id})" class="card pokemon-card ${pokemon['types'][0]['type']['name']}">
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
}


function insertTypeHTML(type) {
    return `
    <div class="pokemon-min-type">${type['type']['name'].charAt(0).toUpperCase() + type['type']['name'].slice(1)}</div>
`;
}


function insertAbilityHTML(ability, a, pokemon) {
    return `
    ${ability['ability']['name'].charAt(0).toUpperCase() + ability['ability']['name'].slice(1)}${returnComma(a, pokemon['abilities'].length)}
    `;
}


function insertLoadingSpinnerHTML() {
    return `
    <div class="pokemon-info-card-background">
        <div class="text-center">
            <div class="spinner-border white" style="width: 3rem; height: 3rem;" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
        </div>
    </div>
    `;
}


function insertOpenPokeCardHTML(j, id, pokemon, typeContainer) {
    return `
    <div class="pokemon-info-card-background" onclick="exitPokeCard()">
        ${lastPokemon(j)}
        <div class="card pokemon-info-card ${pokemon['types'][0]['type']['name']}" onclick="stopPropagation(event)">
            <img class="img-fluid bg-info-card-pokeball" src="./assets/img/pokeball.png" alt="Pokeball">
            <div class="pokemon-info-card-top">
                <div style="padding-left: 20px; padding-right: 20px;">
                    <div class="headline-nav">
                        <img onclick="exitPokeCard()" class="back-arrow" src="./assets/img/back-arrow.png" alt="">
                        <img id="favPokemon${id}" onclick="saveToFav(${id},${j})" class="fav-pokeball" src="${returnFavImgSrc(id)}" alt="">
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
}


function insertOpenFavPokeCardHTML(fav, id, pokemon, typeContainer) {
    return `
    <div class="pokemon-info-card-background" onclick="exitPokeCard()">
        ${lastPokemon(fav)}
        <div class="card pokemon-info-card ${pokemon['types'][0]['type']['name']}" onclick="stopPropagation(event)">
            <img class="img-fluid bg-info-card-pokeball" src="./assets/img/pokeball.png" alt="Pokeball">
            <div class="pokemon-info-card-top">
                <div style="padding-left: 20px; padding-right: 20px;">
                    <div class="headline-nav">
                        <img onclick="exitPokeCard()" class="back-arrow" src="./assets/img/back-arrow.png" alt="">
                        <img id="favPokemon${id}" onclick="saveToFavRendered(${id},${fav})" class="fav-pokeball" src="${returnFavImgSrc(id)}" alt="">
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
                            <td><span id="aboutTab" onclick="aboutTab(${fav})" style="color: #46D1B1;">About</span></td>
                            <td><span id="statsTab" onclick="statsTab(${fav})">Base Stats</span></td>
                            <td><span id="evolutionTab" onclick="evolutionTab()">Evolution</span></td>
                            <td><span id="movesTab" onclick="movesTab(${fav})">Moves</span></td>
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
        ${nextPokemonArrow(fav)}
    </div>
    `;
}


function insertAboutTabHTML(pokemon) {
    return `
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
}


function insertStatsTabHTML(pokemon, total) {
    return `
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


function insertEvolutionTabFrameHTML() {
    return `<div class="pokemon-evolution"><div class="pokemon-evolution-container" id="pokemonEvolutionContainer"></div></div>`;
}


function insertEvolutionTabHTML(ev_pokmCard, ev_pokmSprite, ev_pokms, pokemonEvolutionChainPokemons) {
    return `
    <div><img onclick="openPokeCard(${ev_pokmCard})" class="evolution-pokemon-img" src="${ev_pokmSprite}" alt="Pokemon-Img"></div>
    <div>${evolutionChainArrow(ev_pokms, pokemonEvolutionChainPokemons.length)}</div>
    `;
}


function insertMovesTabFrameHTML() {
    return '<div id="movesContainer" class="moves-container"></div>';
}


function insertMovesTabHTML(moves, m, pokemonMoves) {
    return `       
    <div class="move-single">${moves.charAt(0).toUpperCase() + moves.slice(1)}${returnComma(m, pokemonMoves.length)}</div>      
`;
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


function returnComma(arrayPlace, arrayLength) {
    while (arrayPlace < arrayLength - 1) {
        return ',';
    }
    return '';
}


function evolutionChainArrow(ev_pokms, length) {
    while (ev_pokms < length - 1) {
        return '<img class="evolution-arrow" src="./assets/img/arrow-evolution.png" alt="Arrow">';
    }
    return '';
}