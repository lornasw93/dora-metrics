# DORA Metrics

A trying-to-be-small-but-useful Node.js tool to calculate DORA Metrics.

4 key metrics:
* Deployment Frequency - How often an organisation successfully releases to production
* Lead Time for Change - The amount of time it takes a commit to get into production
* Change Failure Rate - The percentage of deployments causing a failure in production
* Time to Restore Service - How long it takes an organisation to recover from a failure in production

## Deployment Frequency

The easiest metric to calculate - get a list of project deployments by environment and then group by date format(s) i.e. by day, by month and by year; and finally to calculate the throughput % score which is essentially:

throughput % = (count of deployments by environment * count of all deployments) * 100

## Lead Time for Change

## Change Failure Rate

## Time to Restore Service