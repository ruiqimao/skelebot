const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Plugins extends Command {

	get usage() { return '<list|load|unload> [plugin]'; }
	get desc() { return 'manage plugins'; }

	*authorize(user) {
		// Only allowed if the user is an owner.
		return this.authorization.owners.indexOf(user.id) !== -1;
	}

	*process(msg, suffix) {
		// Get the command.
		const args = suffix.split(' ');
		const command = args[0];
		switch (command) {
			case 'list': {
				// List the plugins.
				const plugins = this.bot.plugins
					.map(plugin => plugin.name)
					.join('\n');
				return this.bot.sendMessage(msg, Util.wrap(plugins));
			}
			case 'load': {
				// Get the plugin to load.
				const plugin = args[1] || '';
				return this.bot.load(plugin)
					.then(() => {
						this.bot.sendMessage(msg, Util.wrap('Loaded plugin \'' + plugin + '\'.'));
					})
					.catch(err => {
						ERROR(err);
						this.bot.sendMessage(msg, Util.wrap('Could not load plugin \'' + plugin + '\'.'));
					});
			}
			case 'unload': {
				// Get the plugin to unload.
				const plugin = args[1] || '';

				// Cannot just unload 'utils'.
				if (plugin === 'utils') {
					return this.bot.sendMessage(
						msg,
						Util.wrap('Cannot unload \'utils\' directly. Use \'' + this.config.PREFIX + this.name + ' reload utils\' instead.'));
				}

				return this.bot.unload(plugin)
					.then(() => {
						this.bot.sendMessage(msg, Util.wrap('Unloaded plugin \'' + plugin + '\'.'));
					})
					.catch(err => {
						ERROR(err);
						this.bot.sendMessage(msg, Util.wrap('Could not unload plugin \'' + plugin + '\'.'));
					});
			}
			case 'reload': {
				// Get the plugin to reload.
				const plugin = args[1] || '';
				let unloadFailed = false;
				yield this.bot.unload(plugin)
					.catch(err => {
						ERROR(err);
						this.bot.sendMessage(msg, Util.wrap('Could not unload plugin \'' + plugin + '\'.'));
						unloadFailed = true;
					});

				if (unloadFailed) return;

				return this.bot.load(plugin)
					.then(() => {
						this.bot.sendMessage(msg, Util.wrap('Reloaded plugin \'' + plugin + '\'.'));
					})
					.catch(err => {
						ERROR(err);
						this.bot.sendMessage(msg, Util.wrap('Could not load plugin \'' + plugin + '\'.'));
					});
			}
			default: {
				return this.bot.sendMessage(msg, Util.wrap('Invalid command \'' + command + '\''));
			}
		}
	}

}

module.exports = Plugins;
