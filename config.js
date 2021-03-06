/*
* Create and export configuration variables
*
*/

// Container for all the environments
const environments = {};

// Staging (default) environment
environments.staging = {
	'httpPort': 3000,
	'httpsPort': 3001,
	'envName': 'staging'
};

// Production environment
environments.production = {
	'httpPort': 5000,
	'httpsPort': 5001,
	'envName': 'production'
};

console.log('process.env.NODE_ENV - ', process.env.NODE_ENV);

// Determine wich environment was passed as a command-line argument
const currentEnvironment = typeof(process.env.NODE_ENV) === 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Determine export environment
const environmentToExport = typeof(environments[currentEnvironment]) === 'object' ? environments[currentEnvironment] : environments.staging;

// Export the module
module.exports = environmentToExport;
