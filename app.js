const express = require('express');
const axios = require('axios');
const app = express();

const port = 3000;
const route = require('./routes/route');

app.set('view engine', 'ejs');
app.set("views", './views');
app.use(express.static('public'));

app.use(express.json());
app.use(express.urlencoded( {extended : false } ));
app.use('/', route);
/*app.get('/', async (req, res) => {
    // 날씨 정보를 가져오는 로직을 작성
    // 스포티파이 API를 통해 노래를 추천하는 로직을 작성
    res.render('index', { weatherData, recommendedSongs });
});*/

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});