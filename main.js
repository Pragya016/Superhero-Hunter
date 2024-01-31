// selecting all the elements from html
const homePage = document.querySelector('#superheroes-container')
const searchHeroContainer = document.querySelector('#search-hero-container')
const userInputName = document.getElementById('hero-name');
const allSuperHeroes = document.querySelector('.all-superheroes')
const superHeroName = document.querySelector('.superhero-name');
const favoritesList = document.querySelector('.favorite-content');
const favoriteBtn = document.querySelector('#fav-button');
const favHeroInfo = document.querySelector('.fav-info-para');
let superheroesData;

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
function fetchData() {
  const hash = generateHash(ts, privateKey, publicKey);
  // const apiUrl = `https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  const apiUrl = `https://gateway.marvel.com/v1/public/characters?ts=${ts}&apikey=${publicKey}&hash=${hash}`;
  return apiUrl;
}

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
    input = '';
    window.open('./superhero/hero.html?id=' + data.name, '_blank');
  }
  catch (err) {
    setTimeout(() => {
      window.open('./ErrorPage/error.html', '_blank');
    }, 1000)
  }
})

// execute the function atleast for one time
window.onload = () => {
  getSuperheroes();
};

// fetch data by name
async function fetchDataByName(name, ts, publicKey, hash) {
  const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const res = await req.json();
  const data = res.data.results[0];
  return data
}

// add event listener on favorites button
//this button will show a list of favorite superheroes that would have saved by the user.
favoriteBtn?.addEventListener('click', showFavorites)

let favoriteItems = [];
for (let i = 0; i < localStorage.length; i++) {
  // find key and value
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);

  // add into favorite items list
  if (value !== undefined && value !== null) {
    favoriteItems.push(value);
  }
}

// add favorite items in the container from local storage
favoriteItems.forEach(item => {
  // create elements
  const favoriteItemDiv = document.createElement('div');
  const favoriteItemName = document.createElement('p');
  const reomveBtn = document.createElement('button');

  // assign classes
  favoriteItemDiv.className = 'favorite-item';
  reomveBtn.className = 'remove-fav-item';

  // give text content
  favoriteItemName.textContent = item;
  reomveBtn.textContent = 'Remove';

  // append to parent div
  favoriteItemDiv.appendChild(favoriteItemName);
  favoriteItemDiv.appendChild(reomveBtn);
  favoritesList?.appendChild(favoriteItemDiv);

  // add event listener to remove button
  reomveBtn.addEventListener('click', (e, key) => {
    removefavoriteItem(e, item);
  })

})


// show favorites superheroes
let isFavoritesListEmpty = false;
function showFavorites() {
  if (favoriteItems.length === 0) {
    favHeroInfo.style.display = "block";
  } else {
    favHeroInfo.style.display = "none";
    if (!isFavoritesListEmpty) {
      favoritesList.style.display = 'block';
      isFavoritesListEmpty = true;
    } else {
      favoritesList.style.display = 'none';
      isFavoritesListEmpty = false;
    }
  }
}

// remove favorite item from the list
function removefavoriteItem(e, key) {
  const removed = e.target.closest('.favorite-item');
  favoritesList?.removeChild(removed);
  localStorage.removeItem(key);
}


// show suggestions
userInputName?.addEventListener('input', (e) => {

  superheroesData.forEach(el => {
    if (el.name.includes(e.target.value)) {
      setTimeout(() => console.log(el.name), 2000)
    }
  });
})
