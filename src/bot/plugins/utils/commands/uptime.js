const Command = require('plugin').Command;
const Util = require('plugin').Util;

class Uptime extends Command {

	get desc() { return 'get the uptime'; }

	*process(msg, suffix) {
		// Get the client uptime.
		const uptime = this.client.uptime;

		// Convert the time to a readable format.
		const date = new Date(uptime);
		const days = date.getUTCDate() - 1,
			  hours = date.getUTCHours(),
			  minutes = date.getUTCMinutes(),
			  seconds = date.getUTCSeconds();
		let segments = [];
		if (days > 0) segments.push(days + ' day' + ((days == 1) ? '' : 's'));
		if (hours > 0) segments.push(hours + ' hour' + ((hours == 1) ? '' : 's'));
		if (minutes > 0) segments.push(minutes + ' minute' + ((minutes == 1) ? '' : 's'));
		if (seconds > 0) segments.push(seconds + ' second' + ((seconds == 1) ? '' : 's'));
		const dateString = segments.join(', ');

		// Return the uptime.
		this.bot.sendMessage(msg, Util.wrap(dateString));
	}

}

module.exports = Uptime;
