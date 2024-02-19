// selecting all the elements from html
const homePage = document.querySelector('#superheroes-container')
const searchHeroContainer = document.querySelector('#search-hero-container')
const suggestionsContainer = document.querySelector('#suggestions-container')
const userInputName = document.getElementById('hero-name');
const allSuperHeroes = document.querySelector('.all-superheroes')
const superHeroName = document.querySelector('.superhero-name');
const favoritesList = document.querySelector('.favorite-content');
const favoriteBtn = document.querySelector('#fav-button');
const favHeroInfo = document.querySelector('.fav-info-para');
let superheroesData;

// put every superhero's name in the array so that it may show suggestions whenever user type something
const suggestions = [];

// note: I'm aware of the necessity to keep API keys private. However, for this specific project, 
// the exposure of keys does not compromise security or functionality, aligning with its unique requirements.

// keys
const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

// generate hash
function generateHash(ts, privateKey, publicKey) {
  const stringToHash = ts + privateKey + publicKey;
  return CryptoJS.MD5(stringToHash).toString();
}

// getAPI key
function fetchData() {
  const hash = generateHash(ts, privateKey, publicKey);
  // const apiUrl = `https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  return apiUrl;
}

const data = fetchData();
console.log(data);

// get superheroes and display their names
async function getSuperheroes() {
  try {
    const apiUrl = fetchData();
    const req = await fetch(apiUrl);
    const res = await req.json();
    const data = res.data.results;
    superheroesData = data;
    data.forEach(el => {
      suggestions.push(el.name);
    });
    displayNames(data);

  } catch (err) {
    console.error(err.message);
  }
}

// display suprheroes' names
function displayNames(data) {
  data.forEach(el => {
    const superHeroDiv = document.createElement("div");
    superHeroDiv.className = "superHero";
    const superHeroName = document.createElement("p");
    superHeroName.className = "superhero-name"
    superHeroName.innerHTML = el.name || "";
    superHeroDiv.appendChild(superHeroName);
    superHeroName.addEventListener('click', (details) => displaySuperheroDetails(el));
    allSuperHeroes?.appendChild(superHeroDiv);
  });
}


// display superhero details if user clicks on any name
function displaySuperheroDetails(data) {
  window.open(`./superhero/hero.html?id=${data.name}`, '_blank');
}

// execute the function atleast for one time
window.onload = () => {
  getSuperheroes();
};


// display superhero details on enter keypress
searchHeroContainer?.addEventListener('submit', async () => {
  let input = userInputName.value;
  if (input === '') {
    alert('Invalid Input!')
    return;
  }

  try {
    const hash = generateHash(ts, privateKey, publicKey);
    const data = await fetchDataByName(input, ts, publicKey, hash);
    window.open('./superhero/hero.html?id=' + data.name, '_blank');
    input = '';
  }
  catch (err) {
    window.open('./ErrorPage/error.html', '_self');
  }
})


// fetch data by name
async function fetchDataByName(name, ts, publicKey, hash) {
  const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const res = await req.json();
  const data = res.data.results[0];
  return data
}

// add event listener on favorites button
favoriteBtn?.addEventListener('click', showFavorites);


// show favorites superheroes
function showFavorites() {
  window.open('./favorites/favorites.html', '_blank');
}

// remove favorite item from the list
function removefavoriteItem(e, key) {
  const removed = e.target.closest('.favorite-item');
  favoritesList?.removeChild(removed);
  localStorage.removeItem(key);
}


// show suggestions
userInputName?.addEventListener('input', (e) => {
  const input = e.target.value || '';
  console.log(input)
  const filteredSuggestions = suggestions.filter(suggestion => suggestion.toLowerCase().includes(input.toLowerCase()));
  console.log(filteredSuggestions)
  displaySuggestions(filteredSuggestions);
})

function displaySuggestions(suggestions) {
  suggestionsContainer.innerHTML = '';
  if (suggestions.length > 0) {
    suggestions.forEach(suggestion => {
      console.log(suggestion)
      const div = document.createElement('div');
      div.textContent = suggestion;
      div.classList.add('suggestion-item');
      div.onclick = function () {
        // userInputName.value = suggestion;
        window.open('./superhero/hero.html?id=' + suggestion, '_blank');
      };
      suggestionsContainer.appendChild(div);
    });
    suggestionsContainer.style.display = 'block';
  } else {
    suggestionsContainer.style.display = 'none';
  }
}

document.addEventListener('click', function (event) {
  const isClickInside = userInputName.contains(event.target);
  if (!isClickInside) {
    document.getElementById('suggestions-container').style.display = 'none';
  }
});
