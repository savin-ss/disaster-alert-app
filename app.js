const express = require('express');
const axios = require('axios');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();

const PORT = 3000;
const WEATHER_API_KEY = 'your_openweather_api_key';  // OpenWeather API Key
const EARTHQUAKE_API_URL = 'https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=2024-01-01';

// Middleware
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

// Home route: Fetch weather and earthquake data
app.get('/', async (req, res) => {
    const city = req.query.city || 'Bangalore'; // default city
    const weatherUrl = `http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${WEATHER_API_KEY}&units=metric`;

    try {
        const weatherResponse = await axios.get(weatherUrl);
        const earthquakeResponse = await axios.get(EARTHQUAKE_API_URL);
        const weatherData = weatherResponse.data;
        const earthquakes = earthquakeResponse.data.features; // Array of earthquake data
        res.render('index', { weather: weatherData, earthquakes });
    } catch (error) {
        console.error(error);
        res.render('error', { error: 'Error fetching data. Please try again later.' });
    }
});

// Webhook endpoint for real-time disaster alerts
app.post('/webhook', (req, res) => {
    const disasterData = req.body;
    console.log('Received webhook data:', disasterData);
    res.status(200).send('Webhook received');
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
