let $triggerSettingsButton = document.getElementById('trigger-settings');
let $menuSettingsNav = document.getElementById('menu-settings');
let $weeklyListItems = document.getElementsByClassName("weekly-weather-item");
let $hourlyListItems = document.getElementsByClassName("hourly-weather-item");

const $date= document.getElementById('date');

$triggerSettingsButton.addEventListener('click', () => {
    $menuSettingsNav.classList.toggle('active');
    $triggerSettingsButton.classList.toggle('active');
}, true)

const API_KEY = "92c0ccd51575453bb2c135248231004";

window.addEventListener("load", () => {
    if(navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            console.log(position);

            let {latitude, longitude} = position.coords;
        
            fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${latitude},${longitude}&days=7&aqi=no&alerts=no`)
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
              return response.json();
            })
            .then(data => {
                displayWeather(data);
            })
            .catch((error) => {
                console.log("Request failed", error);
            });
        })
    }
})

const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
};


setInterval(() => {
    const time = new Date();
    document.querySelector(".date").innerText = time.toLocaleString('en-IN', options);
    document.querySelector(".today-date").innerText = "Today, " + time.toLocaleString('en-IN', {day: 'numeric', month: 'long'});

}, 1000);

function fetchWeather(city) {
    fetch(`https://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${city}&days=7&aqi=no&alerts=no`)
    .then((response) => {
        if (!response.ok) {
            alert("No weather found.");
            throw new Error("No weather found.");
        }
      return response.json();
    })
    .then(data => {
        displayWeather(data);
    })
    .catch((error) => {
        console.log("Request failed", error);
    });
}

function getWeekDay(date){
    const arr = date.split('-');
    return new Date(arr[0], arr[1] - 1, arr[2]);
}

function displayWeather(data) {
    const {name, country} = data.location;
    const {temp_c, humidity, uv, wind_kph, pressure_mb, precip_mm, vis_km} = data.current;
    const {text, icon} = data.current.condition;
    const {maxtemp_c, mintemp_c} = data.forecast.forecastday[0].day;
    const {sunrise, sunset} = data.forecast.forecastday[0].astro;

    for(let i = 0; i < 7; i++) {
        const {maxtemp_c, mintemp_c} = data.forecast.forecastday[i].day;
        const {date} = data.forecast.forecastday[i];
        const {icon} = data.forecast.forecastday[i].day.condition;
       

        $weeklyListItems[i].querySelector(".weekly-weather-temperature-max").innerText = maxtemp_c + "°C";
        $weeklyListItems[i].querySelector(".weekly-weather-temperature-min").innerText = mintemp_c + "°C";
        $weeklyListItems[i].querySelector(".week-day").innerText = getWeekDay(date).toLocaleString('en-IN', {weekday: 'short'});
        $weeklyListItems[i].querySelector(".week-weather-icon").src = "https:" + icon;
    }

    for(let i = 0; i < 24; i++){
        const {temp_c} = data.forecast.forecastday[0].hour[i];
        const {icon} = data.forecast.forecastday[0].hour[i].condition;

        $hourlyListItems[i].querySelector(".hourly-weather-icon").src = "https:" + icon;
        $hourlyListItems[i].querySelector(".hourly-weather-temperature").innerText = temp_c + "°C";

    }

    document.querySelector(".city-name").innerText = name + ", " + country;
    document.querySelector(".temp").innerText = temp_c + "°C";

    document.querySelector(".wind-speed").innerText = wind_kph + " km/h";
    document.querySelector(".humidity-percentage").innerText = humidity + " %";

    document.querySelector(".temperature-hight").innerText ="Hight: " + maxtemp_c + "°C";
    document.querySelector(".temperature-low").innerText = "Low: " + mintemp_c + "°C";
    
    document.querySelector(".weather-icon").src = "https:" + icon;
    document.querySelector(".description").innerText = text;
    document.querySelector(".precipitation").innerText = precip_mm + " mm";
    document.querySelector(".pressure").innerText = pressure_mb + " mb";
    document.querySelector(".visibility").innerText = vis_km + " km";
    document.querySelector(".uv-index").innerText = uv;
    document.querySelector(".sunrise").innerText = sunrise;
    document.querySelector(".sunset").innerText = sunset;



    //console.log(name, uv, country, temp_c, humidity, wind_kph, pressure_mb, maxtemp_c, mintemp_c, sunrise, sunset);
}

function search() {
    fetchWeather(document.querySelector(".search-input").value);
}

document.querySelector(".btn-search-submit").addEventListener("click", function () {
     search();
});

document.querySelector(".search-input").addEventListener("keyup", function (event) {
    if(event.key == "Enter") {
        search();
    }
});