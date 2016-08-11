const Plugin = require('plugin').Plugin;

class Template extends Plugin {

	*init() {
		// All plugin initialization code goes here.

		// Add commands here.
		this.addCommand('test', require('./commands/test')); // Command name is "test", location of the command code is in "./commands/test".
		//this.addCommand('database', require('./commands/database')); // Uncomment this if you have a database set up and want to try the demo command.
	}

	*destroy() {
		// All plugin destruction code goes here.
	}

}

module.exports = Template;
