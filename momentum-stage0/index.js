const time = document.querySelector(".time");
const date = document.querySelector(".date");
const greeting = document.querySelector(".greeting");
const name = document.querySelector(".name");
const body = document.querySelector("body");
const slidePrev = document.querySelector(".slide-prev")
const slideNext = document.querySelector(".slide-next")
const audio = new Audio();

const playButton = document.querySelector(".play");
const nextButton = document.querySelector(".play-next");
const prevButton = document.querySelector(".play-prev");
const playlistContainer = document.querySelector(".play-list");

const quote = document.querySelector(".quote")
const author = document.querySelector(".author")
const changeQuote = document.querySelector(".change-quote")
const weatherIcon = document.querySelector(".weather-icon")
const temperature = document.querySelector(".temperature")
const weatherDiscription = document.querySelector(".weather-description")
const weatherCity = document.querySelector(".city")
const wind = document.querySelector(".wind")
const humidity = document.querySelector(".humidity")

let randomNum;

let greetingTranslation = {
    en: ["Good morning", "Good afternoon", "Good evening", "Good night"],
    ru: ["Доброе утро", "Добрый день", "Добрый вечер", "Доброй ночи"],
    be: ["Добрай раніцы", "Добры дзень", "Добры вечар", "Добрай ночы"],
}

const getDefaultPageLanguage = (value = "en") => {
if(navigator.language == "ru") {
    return greetingTranslation.ru;
} else if (navigator.language == "be") {
    return greetingTranslation.be;
} else return greetingTranslation.en;
}

console.log(greetingTranslation)

const showDate = () => {
    const newDate = new Date();
    const options = {month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', timeZone: 'UTC'};
    const currentDate = newDate.toLocaleDateString(navigator.language, options);
    date.textContent = currentDate;
}
const showTime = () => {
    const date = new Date();
    const currentTime= date.toLocaleTimeString();
    time.textContent = currentTime;
    showDate();
    showGreeting();
    setTimeout(showTime, 1000);
}
showTime();

function showGreeting() {

    let currentTime = getTimeOfDay();
    console.log(currentTime);
    if (currentTime >= 6 && currentTime < 12){
        currentTime = getDefaultPageLanguage()[0];
    } else if (currentTime >= 12 && currentTime < 18){
        currentTime = getDefaultPageLanguage()[1];
    } else if (currentTime >= 18 && currentTime < 24){
        currentTime = getDefaultPageLanguage()[2];
    } else {
        currentTime = getDefaultPageLanguage()[3];
    }
    greeting.textContent = `${currentTime}`;
}

function getTimeOfDay() {
    const date = new Date();
    const hours = date.getHours();
    return hours;
}

function setLocalStorage() {
    localStorage.setItem("name", name.value);
}
window.addEventListener('beforeunload', setLocalStorage);

function getLocalStorage() {
    if(localStorage.getItem('name') !== undefined){
        name.value = localStorage.getItem('name');
    }
}
window.addEventListener('load', getLocalStorage);

getRandomNum();
body.style.backgroundImage = setBg();


function getRandomNum (){
        randomNum = Math.floor(Math.random() * 19+1);
}

function setBg () {
    let timeOfDay = getTimeOfDay();

    if (timeOfDay >= 6 && timeOfDay < 12){
        timeOfDay = getDefaultPageLanguage()[0];
    } else if (timeOfDay >= 12 && timeOfDay < 18){
        timeOfDay = getDefaultPageLanguage()[1];
    } else if (timeOfDay >= 18 && timeOfDay < 24){
        timeOfDay = getDefaultPageLanguage()[2];
    } else {
        timeOfDay = getDefaultPageLanguage()[3];
    }

        let bgNum = randomNum.toString().padStart(2 , "0")
    let setBgResult = `url(https://raw.githubusercontent.com/rolling-scopes-school/stage1-tasks/assets/images/${timeOfDay}/${bgNum}.jpg)`;
console.log(setBgResult)
    return setBgResult;
}

function getSlideNext() {

   if(randomNum > 19) {
       randomNum = 1;
   } else randomNum ++;
    body.style.backgroundImage = setBg();
}

function getSlidePrev() {

    if(randomNum > 0) {
        randomNum --;
    } else randomNum = 19;
    body.style.backgroundImage = setBg();
}

slideNext.addEventListener('click', getSlideNext);
slidePrev.addEventListener('click', getSlidePrev);

let isPlaying = false;
let currentTrack = 0;


const playlist = [
  {
    title: 'Aqua Caelestis',
    src: 'assets/sounds/Aqua Caelestis.mp3',
    duration: '00:58'
  },
  {
    title: 'River Flows In You',
    src: 'assets/sounds/River Flows In You.mp3',
    duration: '03:50'
  },
  {
    title: 'Ennio Morricone',
    src: 'assets/sounds/Ennio Morricone.mp3',
    duration: '03:50'
  },
  {
    title: 'Summer Wind',
    src: 'assets/sounds/Summer Wind.mp3',
    duration: '03:50'
  }
]

playlist.forEach((i) => {
  const li = document.createElement("li");
  li.textContent = i.title;
  li.classList.add("play-item");
  playlistContainer.append(li);
});

nextButton.addEventListener('click', () => {
  if (currentTrack < playlist.length - 1) {
    currentTrack++;
  } else {
    currentTrack = 0;
  }
  playAudio();
  transformButtonToPause();
});

prevButton.addEventListener('click', () => {
  if (currentTrack > 0) {
    currentTrack--;
  } else {
    currentTrack = playlist.length - 1;
  }
  transformButtonToPause();
  playAudio();
});


function transformButtonToPause() {
  playButton.classList.remove("play");
  playButton.classList.add("pause");
}

function togglePlayButton() {
  if (!isPlaying) {
    transformButtonToPause();
    playAudio();
  } else {
    playButton.classList.remove("pause");
    playButton.classList.add("play");
    pauseAudio();
  }
}

playButton.addEventListener("click", togglePlayButton);

function playAudio() {
  audio.src = playlist[currentTrack].src;
  audio.currentTime = 0;
  isPlaying = true;
  playlistContainer.childNodes.forEach((track) => track.classList.remove("item-active"));
  playlistContainer.childNodes[currentTrack].classList.add("item-active");
  audio.play();
}

function pauseAudio() {
  audio.pause();
  isPlaying = false;
}

async function getQuotes() {
    const quotes = "quotes.json";
    const res = await fetch(quotes);
    const data = await res.json();
    let pickedQuote = data[getRandomeQuote(data)];
    quote.textContent = pickedQuote.quoteText;
    author.textContent = pickedQuote.quoteAuthor;
}

getQuotes();

changeQuote.addEventListener("click", getQuotes);

function getRandomeQuote (data){
     return Math.floor(Math.random() * data.length);
}

async function getWeather() {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${weatherCity.value}&lang=${navigator.language}&appid=0a10d86d92e88571ff9df3ea1a144408&units=metric`;
    const res = await fetch(url);
    const data = await res.json();


    weatherIcon.className = 'weather-icon owf';
    weatherIcon.classList.add(`owf-${data.weather[0].id}`);
    temperature.textContent = `${data.main.temp}°C`;
    weatherDiscription.textContent = data.weather[0].description;
    wind.textContent = `Wind speed: ${data.wind.speed} m/s`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`
    console.log(data)
}
getWeather()

weatherCity.addEventListener("change", getWeather);


