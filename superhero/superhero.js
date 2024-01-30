// select element from dom
const result = document.querySelector('#result');
const addToFavBtn = document.querySelector('#fav-button');
const favoriteContent = document.querySelector('.favorite-content');
const userInput = document.getElementById('hero-name');

// favorite superhero 
const favorites = ['hi','hello'];

// keys
const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

// fetch hero id from url
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
    console.log(data)
    let description;
    let comics;
    let events;
    let series;
    let stories;

    // check if any series is available 
    if (data.series.available === 0) {
        series = '';
    } else {
        const seriesHtml = data.series.items.map(series => `<p>${series.name}</p>`).join('');
        series = ` <div class="series">
            <h4>Series : </h4>
            <div class='all-series'>
            <p>${seriesHtml}</p>
            </div>
        </div>
        <div class='devider'></div>`
    }

    // check if any story is available 
    if (data.stories.available === 0) { 
        stories = '';
    } else {
        const storiesHtml = data.stories.items.map(story => `<p>${story.name}</p>`).join('');
        stories = ` <div class="stories">
            <h4>Stories : </h4>
            <div class='all-stories'>
            <p>${storiesHtml}</p>
            </div>
        </div>
        <div class='devider'></div>`
    }

    // check if any event is available 
    if (data.events.available === 0) {
        events = ''
    } else {
        const eventsHtml = data.events.items.map(event => `<p>${event.name}</p>`).join('');
        events = `<div class="events">
            <h4>Events : </h4>
            <div class='all-events'>
                <p>${eventsHtml}</p>
            </div>
        </div>`
    }

    // check if any comic is available 
    if (data.comics.available !== 0) {
        const comicsHtml = data.comics.items.map(comic => `<p>${comic.name}</p>`).join('');
        comics = `<div class="comics">
            <h4>Comics : </h4>
            <div class='all-comics'>
            <p>${comicsHtml}</p>
            </div>
        </div>
        <div class='devider'></div>`
    } else {
        comics = ''
    }

    // check if hero description is available 
    if (data.description !== "") {
        description = `<div class="description">
                <h4>Description: </h4>
                <p>${data.description}</p>
                </div>
                <div class='devider'></div>`
    } else {
        description = '';
    }

    // display superhero details
    const html = `
    <div class='hero-details'>
        <div class='details-container'>
        <h1 class="name">${data.name}</h1>
        <div class='hero-img'>
            <img src="${data.thumbnail.path}.${data.thumbnail.extension}"/>
        </div>
        ${description}
        ${comics}
        ${events}
       ${series}
       ${stories}
        </div>
        <button id="favorite">Add to favorites</button>
    </div>
  `;
    
    result?.insertAdjacentHTML('beforeend', html);
    const favoriteBtn = document.querySelector('#favorite');
    favoriteBtn?.addEventListener('click', () => {
        addToFavorites(data.name);
    });
}

// add character to favorites list
let favCount = 1;
function addToFavorites(id) {
    const idIndex = favorites.indexOf(id);
    if (idIndex >= 0) {
        alert('already added to the favorites!')
        return;
    }

    // alert('Added to the favorites');
    favorites.push(id);
    localStorage.setItem(`favorites${favCount}`, id);
    favCount++;
    // favoriteContent?.insertAdjacentHTML('beforeend', favHero);
    console.log(favorites)
}
