// Set the production flag and error printing function.
global.IS_PRODUCTION = (process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'production');
global.ERROR = (err) => {
	if (IS_PRODUCTION) {
		console.error('Error: ' + err.message);
	} else {
		console.error(err.stack);
	}
};

// Add the lib folder as a path for imports.
require('app-module-path').addPath(__dirname + '/lib');

// Start!
require('./src').main();
