const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Reload extends Command {

	get desc() { return 'reload the bot'; }

	*authorize(user) {
		// Only allowed if the user is an owner.
		return this.authorization.owners.indexOf(user.id) !== -1;
	}

	*process(msg, suffix) {
		const response = yield this.bot.sendMessage(msg, Util.wrap('Reloading bot...'));

		// Reload the bot.
		yield this.bot.reload();

		this.bot.updateMessage(response, Util.wrap('Reloading bot...\nReloaded!'));
	}

}

module.exports = Reload;
