class Plugin {

	/*
	 * Create the plugin.
	 *
	 * @param bot The bot.
	 */
	constructor(bot) {
		this.bot = bot;
		this.commands = [];
	}

	/*
	 * Methods used to refer to objects in the bot.
	 */
	get client() { return this.bot.client; }
	get authorization() { return this.bot.authorization; }
	get config() { return this.bot.config; }

	/*
	 * Load the plugin.
	 */
	*load() {
		// Run init() if it exists.
		if (this.init) yield this.init();

		// Load all the commands.
		for (const command of this.commands) {
			yield command.command.load();
		}
	}

	/*
	 * Unload the plugin.
	 */
	*unload() {
		// Unload all the commands.
		for (const command of this.commands) {
			yield command.command.unload();
		}

		// Run destroy() if it exists.
		if (this.destroy) yield this.destroy();
	}

	/*
	 * Add a new command.
	 *
	 * @param name The name of the command.
	 * @param command The prototype of the new command to add.
	 */
	addCommand(name, command) {
		const comm = new command(this);
		comm.name = name;
		this.commands.push({
			name: name,
			command: comm
		});
	}

}

module.exports = Plugin;
