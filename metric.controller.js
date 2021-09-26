const axios = require('axios'),
    date = require('date-and-time');

const chartView = { BY_DAY: 1, BY_MONTH: 2, BY_YEAR: 3 };

exports.calculateDeploymentFrequency = async (req, res) => {
    var projectId = req.params.projectId;
    var environmentId = req.params.environmentId;

    await axios.get(`${process.env.OCTOPUS_DEPLOY_BASE_URL}/deployments?skip=0&take=${process.env.MAX_DEPLOYMENT_COUNT}`, {
        headers: {
            'X-Octopus-ApiKey': process.env.OCTOPUS_DEPLOY_API_KEY,
            'Access-Control-Allow-Origin': process.env.CORS_URL,
            'Access-Control-Allow-Headers': process.env.CORS_HEADERS,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.data != null) {
            var allDeployments = response.data.Items.filter(x => x.ProjectId == projectId).reverse().length;
            var deploymentsByEnv = response.data.Items.filter(x => x.ProjectId == projectId && x.EnvironmentId == environmentId);
            var card = {
                score: (deploymentsByEnv.length * allDeployments) / 100,
                results: getResultsByField(deploymentsByEnv.reverse(), 'Created')
            };

            res.send(card);
        }
        else {
            res.status(404).send('No deployments found');
        }
    }).catch(error => {
        console.log(error);
        res.status(500).send(error);
    });
}

function formatData(records, field, format) {
    const groupBy = (array, key) => {
        return array.reduce((result, currentValue) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

    const source = groupBy(records, field);

    var groupedData = [];

    for (let prop in source) {
        if (Object.prototype.hasOwnProperty.call(source, prop)) {
            var d = new Date(prop);
            var formattedDate;

            if (format == chartView.BY_DAY) {
                formattedDate = date.format(d, 'D MMM YY');
            }
            else if (format == chartView.BY_MONTH) {
                formattedDate = date.format(d, 'MMM YY');
            }
            else if (format == chartView.BY_YEAR) {
                formattedDate = date.format(d, 'YY');
            }

            groupedData.push({ "name": formattedDate, "value": source[prop].length });
        }
    }

    const newSource = groupBy(groupedData, 'name');
    var newGroupedData = [];

    for (let prop in newSource) {
        if (Object.prototype.hasOwnProperty.call(newSource, prop)) {
            newGroupedData.push({ "name": prop, "value": newSource[prop].length });
        }
    }

    return newGroupedData;
}

function calculateAverage(list) {
    const sum = list.map(x => x.value).reduce((a, b) => a + b, 0);
    var avg = (sum / list.length) || 0;
    return Math.round(avg * 100) / 100;
}

function getResultsByField(records, field) {
    var byDayContent = formatData(records, field, chartView.BY_DAY);
    var byMonthContent = formatData(records, field, chartView.BY_MONTH);
    var byYearContent = formatData(records, field, chartView.BY_YEAR);

    return [
        { title: 'By Day', content: byDayContent, average: calculateAverage(byDayContent) },
        { title: 'By Month', content: byMonthContent, average: calculateAverage(byMonthContent) },
        { title: 'By Year', content: byYearContent, average: null }
    ];
}