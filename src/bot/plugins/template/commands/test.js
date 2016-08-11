const Command = require('plugin').Command;

class Test extends Command {

	*init() {
		// All initialization code goes here.
	}

	get usage() { return '<text>'; } // Usage string goes here.
	get description() { return 'a test command'; } // Description of the command goes here.

	*authorize(user) {
		// All authorization of the user to use this command goes here.
		return true;
	}

	*process(msg, suffix) {
		// All command code goes here.

		// Let's just have the bot say the input back.
		this.bot.reply(msg, suffix);
	}

	*destroy() {
		// All destruction code goes here.
	}

}

module.exports = Test;
