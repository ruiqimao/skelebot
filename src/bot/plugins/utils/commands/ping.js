const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Ping extends Command {

	get desc() { return 'pong!'; }

	*process(msg, suffix) {
		return this.bot.sendMessage(msg, Util.wrap('pong'));
	}

}

module.exports = Ping;
