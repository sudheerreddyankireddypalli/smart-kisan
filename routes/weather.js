/**
 * Smart Kisan - Live Weather Service (Open-Meteo)
 * Geocodes village with fallback to district, caches for 10 minutes,
 * provides current conditions and 5-day forecast.
 */
const express = require('express');
const router = express.Router();
const { optionalAuth } = require('../middleware/auth');

router.use(optionalAuth);

// In-memory cache for weather data (10-minute TTL)
const weatherCache = new Map();
const WEATHER_CACHE_TTL_MS = 10 * 60 * 1000;

// WMO Weather interpretation codes (Bilingual Telugu & English)
const WMO_CODES = {
    0: { en: 'Clear sky', te: 'నిర్మలమైన ఆకాశం', icon: '☀️' },
    1: { en: 'Mainly clear', te: 'ఎక్కువగా నిర్మలంగా', icon: '🌤️' },
    2: { en: 'Partly cloudy', te: 'పాక్షికంగా మేఘావృతం', icon: '⛅' },
    3: { en: 'Overcast', te: 'దట్టమైన మేఘాలు', icon: '☁️' },
    45: { en: 'Foggy', te: 'పొగమంచు', icon: '🌫️' },
    48: { en: 'Depositing rime fog', te: 'మంచు పొగ', icon: '🌫️' },
    51: { en: 'Light drizzle', te: 'తేలికపాటి చినుకులు', icon: '🌦️' },
    53: { en: 'Moderate drizzle', te: 'మోస్తరు చినుకులు', icon: '🌦️' },
    55: { en: 'Dense drizzle', te: 'దట్టమైన చినుకులు', icon: '🌧️' },
    61: { en: 'Slight rain', te: 'తేలికపాటి వర్షం', icon: '🌧️' },
    63: { en: 'Moderate rain', te: 'మోస్తరు వర్షం', icon: '🌧️' },
    65: { en: 'Heavy rain', te: 'భారీ వర్షం', icon: '⛈️' },
    71: { en: 'Slight snow', te: 'తేలికపాటి మంచు', icon: '🌨️' },
    80: { en: 'Slight rain showers', te: 'చిరుజల్లులు', icon: '🌦️' },
    81: { en: 'Moderate rain showers', te: 'మోస్తరు జల్లులు', icon: '🌧️' },
    82: { en: 'Violent rain showers', te: 'తీవ్రమైన వర్షపు జల్లులు', icon: '⛈️' },
    95: { en: 'Thunderstorm', te: 'ఉరుములు మెరుపులతో కూడిన వర్షం', icon: '⚡' },
    96: { en: 'Thunderstorm with slight hail', te: 'వడగండ్ల వర్షం', icon: '⛈️' },
    99: { en: 'Thunderstorm with heavy hail', te: 'తీవ్ర వడగండ్ల వర్షం', icon: '⛈️' }
};

function getWeatherInfo(code) {
    return WMO_CODES[code] || { en: 'Partly cloudy', te: 'మేఘావృతం', icon: '⛅' };
}

/**
 * Geocodes a place name via Open-Meteo Geocoding API
 */
async function geocodeLocation(name, stateHint) {
    try {
        const query = encodeURIComponent(`${name} ${stateHint || ''}`.trim());
        const url = `https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=5&language=en&format=json`;
        const res = await fetch(url, { headers: { 'User-Agent': 'SmartKisanApp/1.0' } });
        if (!res.ok) return null;
        const data = await res.json();
        if (data.results && data.results.length > 0) {
            // Find India result
            const match = data.results.find(r => r.country_code === 'IN') || data.results[0];
            return {
                latitude: match.latitude,
                longitude: match.longitude,
                name: match.name,
                admin1: match.admin1
            };
        }
        return null;
    } catch (err) {
        console.error('Geocoding error:', err.message);
        return null;
    }
}

/**
 * GET /api/weather
 * Query params: ?village=...&district=...&state=...
 * If not supplied, defaults to logged-in farmer's location or default AP/Telangana location.
 */
router.get('/', async (req, res) => {
    try {
        const village = req.query.village || req.user?.village || '';
        const district = req.query.district || req.user?.district || 'Warangal';
        const state = req.query.state || req.user?.state || 'Telangana';

        const cacheKey = `${state}:${district}:${village}`.toLowerCase();
        const cached = weatherCache.get(cacheKey);

        if (cached && (Date.now() - cached.timestamp < WEATHER_CACHE_TTL_MS)) {
            return res.json({ ...cached.data, cached: true });
        }

        let geo = null;
        let locationNoteTe = null;
        let locationNoteEn = null;
        let resolvedLocation = district;

        // Try geocoding village first if provided
        if (village && village.trim().length > 1) {
            geo = await geocodeLocation(village, state);
            if (geo) {
                resolvedLocation = `${village}, ${district}`;
            }
        }

        // If village not found or not provided, fall back to district
        if (!geo) {
            geo = await geocodeLocation(district, state);
            if (village && village.trim().length > 1) {
                locationNoteTe = `గ్రామం (${village}) లొకేషన్ దొరకనందున జిల్లా (${district}) వాతావరణం చూపబడుతోంది.`;
                locationNoteEn = `Showing weather for district (${district}) as village coordinates were not found.`;
            }
            resolvedLocation = district;
        }

        // Absolute fallback to Hyderabad / AP center if both geocodes failed (e.g. offline)
        if (!geo) {
            geo = { latitude: 17.9784, longitude: 79.5941, name: district, admin1: state };
        }

        // Fetch Open-Meteo Weather
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${geo.latitude}&longitude=${geo.longitude}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max&timezone=Asia%2FKolkata`;

        const weatherRes = await fetch(weatherUrl, { headers: { 'User-Agent': 'SmartKisanApp/1.0' } });
        if (!weatherRes.ok) {
            throw new Error(`Open-Meteo returned status ${weatherRes.status}`);
        }

        const raw = await weatherRes.json();
        const currentCode = raw.current?.weather_code ?? 0;
        const currentInfo = getWeatherInfo(currentCode);

        // Map 5-day forecast
        const daily = raw.daily || {};
        const forecast = [];
        const times = daily.time || [];

        for (let i = 0; i < Math.min(times.length, 5); i++) {
            const dateStr = times[i];
            const code = daily.weather_code?.[i] ?? 0;
            const info = getWeatherInfo(code);
            const dateObj = new Date(dateStr);
            const dayNamesEn = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            const dayNamesTe = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];
            const dayIndex = dateObj.getDay();

            forecast.push({
                date: dateStr,
                day_en: dayNamesEn[dayIndex],
                day_te: dayNamesTe[dayIndex],
                temp_max: daily.temperature_2m_max?.[i],
                temp_min: daily.temperature_2m_min?.[i],
                rain_probability: daily.precipitation_probability_max?.[i] || 0,
                precipitation_mm: daily.precipitation_sum?.[i] || 0,
                condition_en: info.en,
                condition_te: info.te,
                icon: info.icon
            });
        }

        const responsePayload = {
            location: {
                resolved: resolvedLocation,
                village: village || null,
                district: district,
                state: state,
                latitude: geo.latitude,
                longitude: geo.longitude,
                note_te: locationNoteTe,
                note_en: locationNoteEn
            },
            current: {
                temperature: raw.current?.temperature_2m,
                apparent_temperature: raw.current?.apparent_temperature,
                humidity: raw.current?.relative_humidity_2m,
                wind_speed_kmh: raw.current?.wind_speed_10m,
                precipitation_mm: raw.current?.precipitation || 0,
                weather_code: currentCode,
                condition_en: currentInfo.en,
                condition_te: currentInfo.te,
                icon: currentInfo.icon
            },
            forecast: forecast,
            fetched_at: new Date().toISOString()
        };

        // Cache for 10 minutes
        weatherCache.set(cacheKey, { timestamp: Date.now(), data: responsePayload });

        return res.json({ ...responsePayload, cached: false });
    } catch (err) {
        console.error('Weather service error:', err.message);
        return res.status(503).json({
            error: 'WEATHER_UNAVAILABLE',
            message: 'ప్రస్తుతం వాతావరణ సమాచారం అందుబాటులో లేదు. దయచేసి ఇంటర్నెట్ కనెక్షన్ పరిశీలించండి / Weather data temporarily unavailable. Please check your connection.',
            details: err.message
        });
    }
});

module.exports = router;
