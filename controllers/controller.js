const axios = require('axios');

const owmApiKey = '8df00d070b08179e231e7ba594de2e3c';
const spotifyApiKey = '';
let city = 'Busan';  // 원하는 도시명으로 변경 가능
let lat;
let lon;

const searchCityWeatherApiUrl = () => `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${owmApiKey}`;
const currentPositionWeatherApiUrl = () => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${owmApiKey}`;

const controller ={
    index: (req,res) => {
        axios.get(searchCityWeatherApiUrl())
            .then(response => {
                const weatherData = response.data;
                console.log('Weather Data:', weatherData);
                // 여기에서 날씨 정보를 가지고 원하는 작업을 수행하세요
                res.render('index',{weatherData:weatherData});
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });


    },

    getCurrentPositionWeather: (req, res) => {
        lon = req.body.lon;
        lat = req.body.lat;

        axios.get(currentPositionWeatherApiUrl())
            .then(response => {
                const weatherData = response.data;
                console.log('Weather Data:', weatherData);
                res.json(weatherData);
                // 여기에서 날씨 정보를 가지고 원하는 작업을 수행하세요
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    },
    getSearchCityWeather: (req, res) => {
        city = req.body.city;

        axios.get(searchCityWeatherApiUrl())
            .then(response => {
                const weatherData = response.data;
                console.log('Weather Data:', weatherData);
                // 여기에서 날씨 정보를 가지고 원하는 작업을 수행하세요
                res.json(weatherData);
            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    }
}

module.exports = {controller};