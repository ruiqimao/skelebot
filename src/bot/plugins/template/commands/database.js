const Command = require('plugin').Command;

class Database extends Command {

	*init() {
		// All initialization code goes here.

		// Let's try making a database model.
		this.Count = this.bot.createModel('template-count');
	}

	get usage() { return ''; } // Usage string goes here.
	get description() { return 'count up'; } // Description of the command goes here.

	*authorize(user) {
		// All authorization of the user to use this command goes here.
		return true;
	}

	*process(msg, suffix) {
		// All command code goes here.

		// Let's get the value for this server.
		const entry = yield this.Count.forServer(msg.server.id, 0); // Default value of 0.

		// Increment the value.
		entry.val ++;

		// And let's save the value.
		yield entry.save();

		// Now let's return the value!
		this.bot.reply(msg, entry.val);
	}

	*destroy() {
		// All destruction code goes here.
	}

}

module.exports = Database;
