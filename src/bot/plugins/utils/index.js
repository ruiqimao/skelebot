const Plugin = require('plugin').Plugin;

class Utils extends Plugin {

	*init() {
		this.addCommand('help', require('./commands/help'));
		this.addCommand('ping', require('./commands/ping'));
		this.addCommand('plugins', require('./commands/plugins'));
		this.addCommand('reload', require('./commands/reload'));
		this.addCommand('uptime', require('./commands/uptime'));
		this.addCommand('restart', require('./commands/restart'));
	}

}

module.exports = Utils;
