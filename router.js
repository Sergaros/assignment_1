// Define the handlers
const handlers = {};

// Sample handler
handlers.hello = (data, callback) => {
	// Callback http status code, and a payload object
	callback(200, {'message': 'Hello World!'});
};

// Not found handler
handlers.notFound = (data, callback) => {
	callback(404);
};

// Define a request router
const router = {
	'hello': handlers.hello,
	'notFound': handlers.notFound
}

module.exports = router;
