const express = require('express'),
    app = express(),
    cors = require('cors'),
    dfRoute = require('./routes/deployment-frequency.route'),
    ltfcRoute = require('./routes/lead-time-for-change.route'),
    ttrsRoute = require('./routes/time-to-restore-service.route'),
    cfrRoute = require('./routes/change-failure-rate.route');

require('dotenv').config();

app.use(cors());

app.use('/swagger', function (req, res, next) {
    swaggerDocument.host = req.get('host') + '/api';
    req.swaggerDoc = swaggerDocument;
    next();
}, swaggerUi.serve, swaggerUi.setup());

app.use('/api/deploymentfrequency/:projectId', dfRoute);
app.use('/api/leadtimeforchange', ltfcRoute);
app.use('/api/timetorestoreservice', ttrsRoute);
app.use('/api/changefailurerate', cfrRoute);

const PORT = process.env.PORT || 3000;

app.listen(PORT, function () {
    console.log(`🚀 Server running at ${PORT} 🚀`);
});
