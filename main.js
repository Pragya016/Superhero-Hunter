// selecting all the elements from html
const homePage = document.querySelector('#superheroes-container')
const userInput = document.getElementById('hero-name');
const allSuperHeroes = document.querySelector('.all-superheroes')
const superHeroName = document.querySelector('.superhero-name');
const searchHeroBtn = document.querySelector('.search-hero-btn');

// keys
const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

// generate hash
function generateHash(ts, privateKey, publicKey) {
  1
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

// handling click event on search button
searchHeroBtn.addEventListener("click", async () => {
  const hash = generateHash(ts, privateKey, publicKey);
  const heroName = userInput.value;

  const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${heroName}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
  const res = await req.json();
  const data = res.data.results[0];
  userInput.value = '';
  window.open('./superhero/hero.html?id=' + data.name, '_blank');
})

