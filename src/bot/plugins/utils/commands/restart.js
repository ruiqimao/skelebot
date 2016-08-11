const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Restart extends Command {

	get desc() { return 'restart the bot'; }

	*authorize(user) {
		// Only allowed if the user is an owner.
		return this.authorization.owners.indexOf(user.id) !== -1;
	}

	*process(msg, suffix) {
		yield this.bot.sendMessage(msg, Util.wrap('Restarting...'));
		this.bot.stop();
	}

}

module.exports = Restart;
