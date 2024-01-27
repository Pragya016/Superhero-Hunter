// selecting all the elements from html
const homePage = document.querySelector('#superheroes-container')
const userInput = document.getElementById('hero-name');
const allSuperHeroes = document.querySelector('.all-superheroes')
const superHeroName = document.querySelector('.superhero-name');
const addToFavBtn = document.querySelector('#fav-button');
const searchHeroBtn = document.querySelector('.search-hero-btn');
const result = document.querySelector('#result');
const favoriteContent = document.querySelector('.favorite-content');

let favorites = [];

// keys
const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

// generate hash
function generateHash(ts, privateKey, publicKey) {1
  const stringToHash = ts + privateKey + publicKey;
  return CryptoJS.MD5(stringToHash).toString();
}

// getAPI key
function getAPI() {
  const hash = generateHash(ts, privateKey, publicKey);
  // const apiUrl = `https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  return apiUrl;
}

// get superheroes and display their names
async function getSuperheroes() {
  try {
    const apiUrl = getAPI();
    const req = await fetch(apiUrl);
    const res = await req.json();
    const data = res.data.results;
    displayNames(data);
    
  } catch (err) { 
    console.error(err.message);
  }
}

// display suprheroes' names
let eventHandler;
function displayNames(data) {
  data.forEach(el => {
    eventHandler = () => displaySuperHero(el);
    const html = `<div class="superHero">
    <p class="superhero-name">${el.name}</p>
    </div>`;
    allSuperHeroes?.insertAdjacentHTML("beforeend", html);
  });

  data.forEach(el => {
    const element = document.querySelector('.superHero')
    element?.addEventListener('click', displaySuperHero(el))
  });
}

// attach event listeners to every superhero element
// this function is seperated so that it doesn't get called immediately
function attachEventListeners() {
  const superHeroes = document.querySelectorAll('.superHero');
  superHeroes.forEach(hero => {
    hero.addEventListener('click', eventHandler);
  });
}

// display a particular Superhero
function displaySuperHero(data) {
  const comicsHtml = data.comics.items.map(comic => `<p>${comic.name}</p>`).join('');
  const eventsHtml = data.events.items.map(event => `<p>${event.name}</p>`).join('');
  const seriesHtml = data.series.items.map(series => `<p>${series.name}</p>`).join('');
  const storiesHtml = data.stories.items.map(story => `<p>${story.name}</p>`).join('');

  const html = `
    <h1>Super Hero Details</h1>
    <div class="name">
        <h2>${data.name}</h2>
    </div>
    <div class="description">
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
    <button id='back' onclick="returnToHomePage()">Back</button>
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

    const favHero = `<h1>${id}</h1>`
    favoriteContent?.insertAdjacentHTML('beforeend', favHero);

  console.log('added to favorites!')
} 

// return to home page
function returnToHomePage() {
  Window.location.reload();
}

// execute the function atleast for one time 
window.onload = () => {
  getSuperheroes();
  attachEventListeners();
};

searchHeroBtn.addEventListener("click", async () => {
  const hash = generateHash(ts, privateKey, publicKey);
  const heroName = userInput.value;
  console.log(heroName);

  const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const res = await req.json();
  const data = res.data.results[0];
  userInput.value = '';
  console.log(data);
  window.open('./superhero/hero.html?id=' + data.name, '_blank');
})

// show favorites superheroes
let bool = false;
function showFavorites() {
  if (!bool) {
    favoriteContent.style.display = 'block';
    bool = true;
  } else {
    favoriteContent.style.display = 'none';
    bool = false;
  }
}