require('dotenv').config();
const axios = require('axios');
const map = require('../mappings/map');

const owmApiKey = process.env.OPENWEATHERMAP_API_KEY;
const lastfmApiKey = process.env.LAST_FM_API_KEY;
const kakaoRestApiKey = process.env.KAKAO_REST_API_KEY;

let lat;
let lon;
let weatherData = {};
let songData = {};
let genre;
let randomPage;

const lang = 'kr' //언어
const units = 'metric' //섭씨
const headers = {
    'Authorization': `KakaoAK ${kakaoRestApiKey}`,
};

const kakaoMapUrl = () => `https://dapi.kakao.com/v2/local/geo/coord2regioncode.json?x=${lon}&y=${lat}`
const currentPositionWeatherApiUrl = () => `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&
                                                lang=${lang}&units=${units}&appid=${owmApiKey}`;

const lastfmSearchUrl = () => `https://ws.audioscrobbler.com/2.0/?method=tag.gettoptracks&tag=${genre}&limit=5&page=${randomPage}&api_key=${lastfmApiKey}&format=json`

const controller ={
    index: (req,res) => {
        res.render('index');
    },

    getCurrentPositionWeather: (req, res) => {
        lat = req.body.lat;
        lon = req.body.lon;

        axios.get(kakaoMapUrl(),{
            headers: headers,
        })
            .then(response => {
                const cityName = response.data.documents[0].address_name;
                weatherData = {city : cityName,};
                return axios.get(currentPositionWeatherApiUrl());
        })
            .then(response => {
                // 주어진 날씨 코드
                const weatherCode = response.data.weather[0].id;
                // 날씨 코드에 대한 한글 설명 찾기
                const weatherDescObj = map.weatherDescKo.find(item => Object.keys(item)[0] == weatherCode);
                // 찾은 설명이 있다면 해당 값을 가져오고, 없다면 기본 메시지 표시
                const weatherDescKorean = weatherDescObj ? Object.values(weatherDescObj)[0] : '알 수 없는 날씨';
                // 날씨 코드에 대한 노래 장르 찾기
                const weatherGenre = map.weatherGenres.find(item => Object.keys(item)[0] == weatherCode);
                // 장르가 있다면 해당 값을 가져옴
                genre = weatherGenre ? Object.values(weatherGenre)[0] : 'k-pop';
                weatherData = {
                    ...weatherData,
                    main: response.data.weather[0].main,
                    temp : response.data.main.temp,
                    feels_temp : response.data.main.feels_like,
                    humidity: response.data.main.humidity,
                    wind_speed: response.data.wind.speed,
                    weatherInfo : weatherDescKorean,
                    weatherIcon : response.data.weather[0].icon,
                    sunrise : response.data.sys.sunrise,
                    sunset : response.data.sys.sunset,
                    genre : genre,
                };
                res.json(weatherData);
                // 여기에서 날씨 정보를 가지고 원하는 작업을 수행하세요
                return axios.get(lastfmSearchUrl());
            })
            .then(response => {

            })
            .catch(error => {
                console.error('Error fetching weather data:', error);
            });
    },
    searchSong: async (req, res) => {
        try {
            // randomPage 설정
            randomPage = getRandomNumber();

            // randomPage 설정 후 Axios 요청
            const response = await axios.get(lastfmSearchUrl());

            // response.data.tracks.track이 배열인지 확인
            if (Array.isArray(response.data.tracks.track)) {
                // songData를 초기화
                songData = response.data.tracks.track.map(track => ({
                    name: track.name,
                    artist: track.artist.name,
                    img: '',
                }));

                // songData 배열을 순회하며 getImageForSong을 호출하는 Promise들을 생성합니다.
                const requests = songData.map(song => getImageForSong(song));

                // Promise.all을 사용하여 모든 비동기 작업이 완료될 때까지 기다립니다.
                const updatedSongData = await Promise.all(requests);

                // 여기에서 응답을 클라이언트에게 전송하거나 다른 작업 수행 가능
                res.status(200).json(updatedSongData);
            } else {
                throw new Error("응답에서 트랙을 찾을 수 없습니다");
            }
        } catch (error) {
            console.error(error);
            // 에러 발생 시 응답 전송
            res.status(500).json({ error: "내부 서버 오류" });
        }
    },
}
function getRandomNumber() {
    // 1부터 20까지의 랜덤한 정수를 생성
    var randomNumber = Math.floor(Math.random() * 20) + 1;
    return randomNumber;
}

const getImageForSong = (song) => {
    return axios.get(`https://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key=${lastfmApiKey}&artist=${song.artist}&track=${song.name}&format=json`)
        .then(response => {
            song.img = response.data.track.album.image[3]['#text'];
            return song;  // 수정된 song을 반환하여 Promise 체인에 전달
        })
        .catch(error => {
            console.error(error);
            return song;  // 에러가 발생하더라도 song을 반환하여 Promise 체인에 전달
        });
};
module.exports = {controller};