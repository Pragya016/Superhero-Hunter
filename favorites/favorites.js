'use strict';

const favoritesContainer = document.querySelector('#favorite-superheroes');
const info = document.querySelector('.info');

let favoriteItems = [];
for (let i = 0; i < localStorage.length; i++) {
    // find key and value
    const key = localStorage.key(i);
    const value = localStorage.getItem(key);
    favoriteItems.push(value);
}

// add favorite items in the container from local storage
favoriteItems.forEach(item => {
    // create elements
    const card = document.createElement('div');
    const name = document.createElement('p');
    const image = document.createElement('img');
    const btn = document.createElement('button');

    // give value
    name.textContent = item;
    image.src = 'http://i.annihil.us/u/prod/marvel/i/mg/9/30/535feab462a64.jpg'
    btn.textContent = 'remove';

    // assign class name
    card.className = 'favorite-card';
    name.className = 'superhero-name'
    image.className = 'superhero-img';
    btn.className = 'remove-btn';

    // add event listener
    btn.addEventListener('click', (e) => removeFromFavorites(e, item));

    // append child nodes to the parent nodes
    card.append(name, image, btn)
    favoritesContainer?.appendChild(card);
})

function removeFromFavorites(e, key) {
    const element = e.target.closest('.favorite-card');
    favoritesContainer?.removeChild(element);
    localStorage.removeItem(key);
}