const Util = require('./util');

class Command {

	/*
	 * Create the command.
	 *
	 * @param plugin The parent plugin.
	 */
	constructor(plugin) {
		this.plugin = plugin;
	}

	/*
	 * Methods used to refer to objects in the plugin.
	 */
	get bot() { return this.plugin.bot; }
	get authorization() { return this.plugin.authorization; }
	get client() { return this.plugin.client; }
	get config() { return this.plugin.config; }

	/*
	 * Load the command.
	 */
	*load() {
		// Run init() if it exists.
		if (this.init) yield this.init();
	}

	/*
	 * Unload the command.
	 */
	*unload() {
		// Run destroy() if it exists.
		if (this.destroy) yield this.destroy();
	}

	/*
	 * Run the command.
	 *
	 * @param msg The message that triggered the command.
	 * @param suffix The suffix of the command.
	 */
	*run(msg, suffix) {
		// Authorize the user.
		if (this.authorize) {
			const allowed = yield this.authorize(msg.author);
			if (!allowed) return this.bot.sendMessage(msg, Util.wrap('Permission denied.'));
		}

		// Call process() if it exists.
		if (this.process) yield this.process(msg, suffix);
	}

}

module.exports = Command;
