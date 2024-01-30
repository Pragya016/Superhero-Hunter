// selecting all the elements from html
const homePage = document.querySelector('#superheroes-container')
const userInput = document.getElementById('hero-name');
const allSuperHeroes = document.querySelector('.all-superheroes')
const superHeroName = document.querySelector('.superhero-name');
const searchHeroBtn = document.querySelector('.search-hero-btn');
const favoritesList = document.querySelector('.favorite-content');
const favoriteBtn = document.querySelector('#fav-button');
const favHeroInfo = document.querySelector('.fav-info-para');
let heroData;

// put every superhero's name in the array so that it may show suggestions whenever user type something
const suggestions = [];

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
    console.log(res)
    const data = res.data.results;
    heroData = data;
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
    superHeroName.innerHTML = el.name || "-";
    superHeroDiv.appendChild(superHeroName);
    superHeroName.addEventListener('click', () => displaySuperHero(el));
    allSuperHeroes?.appendChild(superHeroDiv);
  });
}


// display a particular Superhero
function displaySuperHero(data) {
  window.open('./superhero/hero.html?id=' + data.name, '_blank');
}

// execute the function atleast for one time 
window.onload = () => {
  getSuperheroes();
};

// show suggestions
userInput?.addEventListener('input', (e) => {

  heroData.forEach(el => {
    if (el.name.includes(e.target.value)){
      console.log(el.name);
    }
  });
})

// handling click event on search button
searchHeroBtn.addEventListener("click", async () => {
  const hash = generateHash(ts, privateKey, publicKey);
  const heroName = userInput.value;

  // show an alert if user hasn't typed enything
  if (heroName === '') {
    alert('Invalid user input!');
    return;
  }

  try {
    const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const res = await req.json();
    const data = res.data.results[0];
    userInput.value = '';
    window.open('./superhero/hero.html?id=' + data.name,);
  }
  catch (err) { 
    setTimeout(() => {
      window.open('./ErrorPage/error.html', '_self');
    }, 1000)
  }
})

favoriteBtn?.addEventListener('click', showFavorites)

let favoriteItems = [];
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);

  if (value !== undefined && value !== null) {
    favoriteItems.push(value);
  }
}

// add favorite items to the container from local storage
favoriteItems.forEach(item => {
  const favoriteItemDiv = document.createElement('div');
  const favoriteItemName = document.createElement('p');
  const reomveBtn = document.createElement('button');
  favoriteItemDiv.className = 'favorite-item';
  reomveBtn.className = 'remove-fav-item';
  favoriteItemName.textContent = item;
  reomveBtn.textContent = 'Remove';

  favoriteItemDiv.appendChild(favoriteItemName);
  favoriteItemDiv.appendChild(reomveBtn);
  favoritesList?.appendChild(favoriteItemDiv);

  reomveBtn.addEventListener('click', (e, key) => {
    removefavoriteItem(e, item);
  })

})


// show favorites superheroes
let isFavoritesListEmpty = false;
function showFavorites() {
  if (favoriteItems.length !== 0) {
    // alert("You Haven't marked any superhero as favorite yet. Explore superheores to mark them as favorite!");
    favHeroInfo.style.display = "none";
  }

  if (!isFavoritesListEmpty) {
    favoritesList.style.display = 'block';
    isFavoritesListEmpty = true;
  } else {
    favoritesList.style.display = 'none';
    isFavoritesListEmpty = false;
  }
}

// remove favorite item from the list 
function removefavoriteItem(e, key) {
  const removed = e.target.closest('.favorite-item');
  favoritesList?.removeChild(removed);
  localStorage.removeItem(key);
}