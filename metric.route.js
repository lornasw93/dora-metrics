const express = require('express'),
    router = express.Router(),
    controller = require('./metric.controller');

router.get('/deploymentfrequency/:projectId/:environmentId', controller.calculateDeploymentFrequency);

module.exports = router;