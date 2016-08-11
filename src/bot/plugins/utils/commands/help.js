const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Help extends Command {

	get usage() { return '<command>'; }
	get desc() { return 'show this helpful list'; }

	*process(msg, suffix) {
		// Get all commands the user is allowed to use.
		let commands = [];
		for (const command of this.bot.commands) {
			let allowed = true;
			if (command.command.authorize) allowed = yield command.command.authorize(msg.author);
			if (allowed) commands.push(command);
		}

		if (suffix) { // Show the help for one command.
			// Get the command.
			const command = commands.find(element => element.name === suffix);
			if (command === undefined) {
				return this.bot.sendMessage(msg, Util.wrap('Unknown command \'' + suffix + '\'.'));
			}

			// Return the help entry for the command.
			return this.bot.sendMessage(msg, Util.wrap(this.generateHelpString(command)));
		} else { // Show the help for all commands.
			// Get the help entries for all commands.
			const helpStrings = commands
				.map(this.generateHelpString.bind(this))
				.join('\n');

			// Return the help entries.
			return this.bot.sendMessage(msg, Util.wrap(helpStrings));
		}
	}

	/*
	 * Generate the help string for a command.
	 *
	 * @param command The command.
	 */
	generateHelpString(command) {
		const name = command.name;
		const comm = command.command;
		let string = this.config.PREFIX + name;
		if (comm.usage) string += ' ' + comm.usage;
		if (comm.desc) string += ': ' + comm.desc;
		return string;
	}

}

module.exports = Help;
