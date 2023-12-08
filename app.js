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

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});