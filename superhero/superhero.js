// select element from dom
const result = document.querySelector('#result');
const addToFavBtn = document.querySelector('#fav-button');
const favoriteContent = document.querySelector('.favorite-content');
const userInput = document.getElementById('hero-name');

// favorite superhero 
const favorites = [];

const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

// getting the hero id from url
function getIdFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dataValue = urlParams.get('id');
    return dataValue;
}

const heroId = getIdFromURL();

// generate hash 
function generateHash(ts, privateKey, publicKey) {
    const stringToHash = ts + privateKey + publicKey;
    return CryptoJS.MD5(stringToHash).toString();
}

// get suoerhero data
async function getHeroData(name) {
    const hash = generateHash(ts, privateKey, publicKey);
    const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const res = await req.json();
    const data = res.data.results[0];
    displaySuperHero(data);
}

getHeroData(heroId);

function displaySuperHero(data) {
    const comicsHtml = data.comics.items.map(comic => `<p>${comic.name}</p>`).join('');
    const eventsHtml = data.events.items.map(event => `<p>${event.name}</p>`).join('');
    const seriesHtml = data.series.items.map(series => `<p>${series.name}</p>`).join('');
    const storiesHtml = data.stories.items.map(story => `<p>${story.name}</p>`).join('');

    
    const html = `
    <div class='hero-details'>
    <h1 class='heading'>Super Hero Details</h1>
    <div ">
        <h2 class="name>${data.name}</h2>
    </div>
    <div class="description">
        <h4>Description : </h4>
        <p>${data.description}</p>
    </div>
    <div class="comics">
        <h4>Comics : </h4>${comicsHtml}
    </div>
    <div class="events">
        <h4>Events : </h4>${eventsHtml}
    </div>
    <div class="series">
        <h4>Series : </h4>${seriesHtml}
    </div>
    <div class="stories">
        <h4>Stories : </h4>${storiesHtml}
    </div>
    <img src="${data.thumbnail.path}.${data.thumbnail.extension}" class="hero-img"/>
    <button id="favorite" onclick="addToFavorites(${data.id})">Add to favorites</button>
    </div>
  `;
    
    result?.insertAdjacentHTML('beforeend', html);
}

// add character to favorites list
function addToFavorites(id) {
    const idIndex = favorites.indexOf(id);
    if (idIndex >= 0) {
        alert('already added to favorites!')
        return;
    }

    favorites.push(id);

    // adding item to local storage
    localStorage.setItem('Name', id);
    console.log(localStorage.getItem(id))

    const favHero = `<h1>${id}</h1>`
    favoriteContent?.insertAdjacentHTML('beforeend', favHero);
    console.log('added to favorites!')
}


// show favorites superheroes
let bool = false;
function showFavorites() {
    if (!bool) {
        console.log('1')
        favoriteContent.style.display = 'block';
        bool = true;
    } else {
        console.log(2)
        favoriteContent.style.display = 'none';
        bool = false;
    }
}