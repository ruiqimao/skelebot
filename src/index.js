const Authorization = require('./authorization');

const Bot = require('./bot');

function main() {
	// Create a new bot.
	const bot = new Bot(Authorization);

	// Catch events.
	bot.on('connect', () => console.log(bot.client.user.name + ' connected.'));
	bot.on('ready', () => console.log(bot.client.user.name + ' ready.'));
	bot.on('end', () => process.exit(0));
	bot.on('error', (err) => {
		ERROR(err);
		process.exit(1);
	});

	// Start.
	bot.start();

	// Catch SIGINT and SIGTERM.
	const shutdown = () => {
		console.log('Shutting down...');

		// Stop the bot.
		bot.stop();

		// Force a shutdown after 5 seconds.
		setTimeout(() => {
			process.exit(0);
		}, 5000);
	};
	process.on('SIGINT', shutdown);
	process.on('SIGTERM', shutdown);
}

exports.main = main;
