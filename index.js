/*
* primary file for the API
*
*/

// Dependencies
const http = require('http');
const https = require('https');
const url = require('url');
const fs = require('fs');
const StringDecoder = require('string_decoder').StringDecoder;

const config = require('./config');
const router = require('./router');

// All the server logic for both the http and https server
const unifiedServer = (req, res) => {
	// Get the URL and parse it
	const parsedUrl = url.parse(req.url, true);

	// Get the path
	const path = parsedUrl.pathname;
	const trimmedPath = path.replace(/^\/+|\/+$/g, '');

	// Get the query string as an object
	const queryStringObject = parsedUrl.query;

	// Get the HTTP Method
	const method = req.method.toLowerCase();

	// Get the headers as an object
	const headers = req.headers;

	// Get the payload, if any
	const decoder = new StringDecoder('utf-8');
	let buffer = '';
	req.on('data', (data) => {
		buffer += decoder.write(data);
	});
	req.on('end', () => {
		buffer += decoder.end();

		// Choose the handler this request should go to
		const chosenHandler = typeof(router[trimmedPath]) !== 'undefined' ?
			router[trimmedPath] : router.notFound;

		// Construct the data object to send to the object
		const data = {
			trimmedPath,
			queryStringObject,
			method,
			headers,
			payload: buffer
		};

		// Route the request to the handler specified in the router
		chosenHandler(data, (statusCode, payload) => {
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			payload = typeof(payload) == 'object' ? payload : {};

			// Convert the payload to the string
			const payloadString = JSON.stringify(payload);

			// Send the response
			res.setHeader('Content-Type', 'application/json');
			res.writeHead(statusCode);
			res.end(payloadString);

			// Log the request path
			console.log(`request received on path: ${trimmedPath},
				with method: ${method},
				with query: ${JSON.stringify(queryStringObject)}
				with headers: ${JSON.stringify(headers)}
				with payload: ${buffer}`);
		});
	});
};

// Instantiate the http server
const httpServer = http.createServer((req, res) => {
	unifiedServer(req, res);
});

// Start the http server
httpServer.listen(config.httpPort, () => {
	console.log(`The http server (${config.envName}) is listening on port ${config.httpPort} now.`);
});

// Instantiate the https server
const httpsServerOptions = {
	'key':	fs.readFileSync('./https/key.pem'),
	'cert':	fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, (req, res) => {
	unifiedServer(req, res);
});

// Start the https server
httpsServer.listen(config.httpsPort, () => {
	console.log(`The https server (${config.envName}) is listening on port ${config.httpsPort} now.`);
});
