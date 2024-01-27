const publicKey = '4030d53488ca263a048f5b7092321655';
const privateKey = '1f67b46629d4ed8557fb227e6c8aa7da9db40b98';
const ts = new Date().getTime().toString();

function getDataFromURL() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const dataValue = urlParams.get('id');
    return dataValue;
}

const heroName = getDataFromURL();

// generate hash 
function generateHash(ts, privateKey, publicKey) {
    const stringToHash = ts + privateKey + publicKey;
    return CryptoJS.MD5(stringToHash).toString();
}

async function getHeroData(name) {
    const hash = generateHash(ts, privateKey, publicKey);
    const req = await fetch(`https://gateway.marvel.com/v1/public/characters?name=${name}&ts=${ts}&apikey=${publicKey}&hash=${hash}`);
    const res = await req.json();
    const data = res.data.results[0];
    console.log(data);
}

getHeroData(heroName);