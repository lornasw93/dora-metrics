const express = require('express'),
    app = express(),
    cors = require('cors'),
    metricRoute = require('./metric.route');

require('dotenv').config();

app.use(cors());

app.use('/api', metricRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`🚀 Server running at ${PORT} 🚀`);
});
