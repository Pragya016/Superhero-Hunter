// select element from dom
const result = document.querySelector('#result');
const addToFavBtn = document.querySelector('#fav-button');
const userInput = document.getElementById('hero-name');
const heroImageContainer = document.querySelector('.superhero-image');
const heroDetailsContainer = document.querySelector('.superhero-details');

// favorite superhero 
// const favorites = [];

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

// display superhero card
function displaySuperHero(data) {
    let description;
    let comics;
    let events;
    let series;
    let stories;

    // appped superhero image to superhero image container
    const heroImage = document.createElement('img');
    heroImage.src = data.thumbnail.path + "." + data.thumbnail.extension
    heroImageContainer?.appendChild(heroImage);


    // check if any series is available 
    if (data.series.available === 0) {
        series = '';
    } else {
        series = `<div class='series'>
            <p class='series-heading'>Series :</p>
            <p>${data.series.available}</p>
        </div>`
    }

    // check if any story is available
    if (data.stories.available === 0) {
        stories = '';
    } else {
        const storiesHtml = data.stories.items.map(story => `<p>${story.name}</p>`).join('');
        stories = `<div class='stories'>
            <p class='stories-heading'>Stories :</p>
            <p>${data.stories.available}</p>
        </div>`
    }

    // check if any event is available
    if (data.events.available === 0) {
        events = ''
    } else {
        const eventsHtml = data.events.items.map(event => `<p>${event.name}</p>`).join('');
        events = ` <div class='events'>
            <p class='events-heading'>Events :</p>
            <p>${data.events.available}</p>
        </div>`
    }

    // check if any comic is available
    if (data.comics.available !== 0) {
        const comicsHtml = data.comics.items.map(comic => `<p>${comic.name}</p>`).join('');
        comics = `<div class='comics'>
            <p class='comic-heading'>Comics :</p>
            <p>${data.comics.available}</p>
        </div>`
    } else {
        comics = ''
    }

    // check if hero description is available
    if (data.description !== "") {
        description = `<div class='details'>
            <p class='details-heading'>Description :</p>
            <p>${data.description}</p>
        </div>`
    } else {
        description = '';
    }


    // append superhero details to superhero details container
    const details = `
        <div class='superhero-name'>
            <p class='name'>Name :</p>
            <p>${data.name}</p>
        </div>
        ${comics}
        ${series}
        ${stories}
       ${events}
        ${description}
    `

    heroDetailsContainer?.insertAdjacentHTML('afterbegin', details)

    // create button 
    const favBtn = document.createElement('button');
    favBtn.id = 'favorite'

    // check if key exists in local storage, set text content accordingly
    const key = checkKeyInLocalStorage(data.name);
    if (key) {
        favBtn.textContent = 'Added Successfully';
    } else {
        favBtn.textContent = 'Add to favorites';
    }

    // add event listener on favorite button
    favBtn?.addEventListener('click', () => {
        const key = checkKeyInLocalStorage(data.name);
        if (!key) {
            favBtn.textContent = `Added Successfully`;
            addToFavorites(data);
        } else {
            alert('Already added to the favorites!')
        }
    });


    result?.appendChild(favBtn);
}

// add character to favorites list
function addToFavorites(id) {
    const obj = {
        name: id.name,
        image: id.thumbnail.path + '.' + id.thumbnail.extension,
    }

    console.log(obj);

    const key = checkKeyInLocalStorage(id.name);
    if (!key) {
        // add to local storage
        localStorage.setItem(id.name, id.name);
    }
}

function checkKeyInLocalStorage(id) {
    const key = localStorage.key(id);
    const value = localStorage.getItem(id);
    if (value === undefined || value === null) {
        return false;
    }

    return true;
} 