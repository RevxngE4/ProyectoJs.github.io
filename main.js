const api = {
    key: '151525e4db1ce41736a12b777f18b69f',
    url: `https://api.openweathermap.org/data/2.5/weather`
}

const card = document.getElementById('card')

const city = document.getElementById('city');
const date = document.getElementById('date');
const tempImg = document.getElementById('temp-img');
const temp = document.getElementById('temp');
const weather = document.getElementById('weather');
const range = document.getElementById('range');

function updateImages(data) {
    const temp = toCelsius(data.main.temp);
    let src = 'images/temp-mid.png';
    if (temp > 26) {
        src = 'images/temp-high.png';
    } else if (temp < 20) {
        src = 'images/temp-low.png';
    }
    tempImg.src = src;
}

async function search(query) {
    try {
        const response = await fetch(`${api.url}?q=${query}&appid=${api.key}&lang=en`);
        const data = await response.json();
        card.style.display = 'block';
        city.innerHTML = `${data.name}, ${data.sys.country}`;
        date.innerHTML = (new Date()).toLocaleDateString();
        temp.innerHTML = `${toCelsius(data.main.temp)}°C`;
        weather.innerHTML = data.weather[0].description;
        range.innerHTML = `${toCelsius(data.main.temp_min)}c / ${toCelsius(data.main.temp_max)}c`;
        updateImages(data);
    } catch (err) {
        console.log(err);
        alert('Hubo un error');
    }
}

function toCelsius(kelvin) {
    return Math.round(kelvin - 273.15);
}

function onSubmit(event) {
    event.preventDefault();
    search(searchbox.value);
}

const searchform = document.getElementById('search-form');
const searchbox = document.getElementById('searchbox');
searchform.addEventListener('submit', onSubmit, true);
//////
function getGeoLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            searchByCoordinates(latitude, longitude);
        });
    } else {
        alert('Geolocalización no es compatible en este navegador.');
    }
}

function searchByCoordinates(latitude, longitude) {
    search(`lat=${latitude}&lon=${longitude}`);
}

window.addEventListener('load', getGeoLocation);
////
// Obtener la última ubicación del usuario
function getSavedLocation() {
    const savedLocation = localStorage.getItem('userLocation');
    if (savedLocation) {
        return JSON.parse(savedLocation);
    }
    return null;
}

// Guardar la ubicación del usuario en el localStorage
function saveLocationToLocalStorage(latitude, longitude) {
    const userLocation = {
        latitude,
        longitude
    };
    localStorage.setItem('userLocation', JSON.stringify(userLocation));
}

// Obtener la ubicación del usuario y guardarla
function getAndSaveUserLocation() {
    if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            saveLocationToLocalStorage(latitude, longitude);
            // Puedes realizar otras acciones con la ubicación aquí si es necesario
        });
    } else {
        alert('Geolocalización no es compatible en este navegador.');
    }
}

// Ejemplo de cómo utilizar las funciones
const lastLocation = getSavedLocation();

if (lastLocation) {
    // Si hay una ubicación guardada, puedes usar lastLocation.latitude y lastLocation.longitude
    console.log('Última ubicación del usuario:', lastLocation.latitude, lastLocation.longitude);
} else {
    // Si no hay una ubicación guardada, obtén la ubicación del usuario y guárdala
    getAndSaveUserLocation();
}
