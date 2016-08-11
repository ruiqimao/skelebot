const Client = require('discord.js').Client;
const EventEmitter = require('events');

const Mongorito = require('mongorito');
const Model = require('mongorito').Model;

const co = require('co');
const decache = require('decache');

class Bot extends EventEmitter {

	/*
	 * Creates the bot.
	 *
	 * @param authorization The authorization data.
	 */
	constructor(authorization) {
		super();

		// Assign the member variables.
		this.authorization = authorization;
		this.config = require('./config');
		this.client = null;
		this.db = null;
		this.plugins = [];
		this.queue = [];
	}

	/*
	 * Start the bot.
	 */
	start() {
		// Attempt to connect to the database if one is specified.
		if (this.authorization.mongo_uri && this.db === null) {
			Mongorito.connect(this.authorization.mongo_uri).then(db => {
				this.db = db;

				// Try starting again.
				this.start();
			}).catch(ERROR);

			return;
		}

		// Create a new client.
		this.client = new Client({
			forceFetchUsers: true,
			rateLimitAsError: true
		});

		// Catch all errors.
		this.client.on('error', err => this.emit('error', err));

		// Catch disconnect.
		this.client.on('disconnected', () => this.emit('end'));

		// Wait for ready.
		this.client.on('ready', () => {
			this.emit('connect');

			// Load everything.
			this.reload()
				.then(() => {
					this.emit('ready')
				})
				.catch(ERROR);
		});

		// Catch messages.
		this.client.on('message', this.handleMessage.bind(this));

		// Login.
		if (this.authorization.token) {
			// Token takes precedence.
			this.client.loginWithToken(this.authorization.token)
				.catch(err => this.emit('error', err));
		} else {
			// Otherwise try email and password.
			this.client.login(this.authorization.email, this.authorization.password)
				.catch(err => this.emit('error', err));
		}
	}

	/*
	 * Stop the bot.
	 */
	stop() {
		// Unload all the plugins.
		this.unload()
			.then(() => {
				// Disconnect from the database.
				if (this.db) this.db.close();

				// Disconnect the bot.
				this.client.logout();
			})
			.catch(ERROR);
	}

	/*
	 * Load a/all plugin(s).
	 *
	 * @param name The name of the plugin to unload. Unload all if not defined.
	 *
	 * @return A Promise.
	 */
	load(name) {
		return co(function*() {
			// If the name is undefined, load all the plugins.
			if (name === undefined) {
				// Load all plugins in the config.
				for (const plugin of this.config.PLUGINS) {
					yield this.load(plugin).catch(ERROR);
				}
			} else {
				// Make sure the plugin isn't already loaded.
				if (this.plugins.find(element => element.name === name)) {
					throw new Error(`Plugin "${ name }" is already loaded.`);
				}

				// Load the plugin.
				const Plugin = require('./plugins/' + name);
				const plugin = new Plugin(this);
				this.plugins.push({
					name: name,
					plugin: plugin
				});
				yield plugin.load();
				console.log(`Loaded plugin "${ name }".`);
			}
		}.bind(this));
	}

	/*
	 * Unload a/all plugin(s).
	 *
	 * @param name The name of the plugin to unload. Unload all if not defined.
	 *
	 * @return A Promise.
	 */
	unload(name) {
		return co(function*() {
			// If the name is undefined, unload all the plugins.
			if (name === undefined) {
				const plugins = this.plugins.slice();
				for (const plugin of plugins) {
					yield this.unload(plugin.name).catch(ERROR);
				}
			} else {
				// Unload the plugin.
				const index = this.plugins.findIndex(element => element.name === name);
				const plugin = this.plugins[index];
				if (plugin === undefined) throw new Error(`No plugin with name "${ name }".`);
				yield plugin.plugin.unload();
				this.plugins.splice(index, 1);
				decache('./plugins/' + name);
				console.log(`Unloaded plugin "${ name }".`);
			}
		}.bind(this));
	}

	/*
	 * Reload everything.
	 *
	 * @return A Promise.
	 */
	reload() {
		return co(function*() {
			// Unload all the plugins.
			yield this.unload();

			// Reload the config.
			decache('./config');
			this.config = require('./config');

			// Load all the plugins.
			yield this.load();
		}.bind(this));
	}

	/*
	 * Handle a message.
	 */
	handleMessage(msg) {
		co(function*() {
			// Trim and ensure the contents of the message start with the prefix.
			const contents = msg.content.trim();
			if (!contents.startsWith(this.config.PREFIX)) return;

			// Get the parts of the command.
			const commandBase = contents.split(/[ \n]/)[0];
			const commandName = commandBase.substring(this.config.PREFIX.length).trim();
			const commandSuffix = contents.substring(commandBase.length).trim();

			// Check if the command is actually a command.
			const command = this.commands.find(element => element.name === commandName);
			if (command !== undefined) {
				// Run the command.
				yield command.command.run(msg, commandSuffix);
			}
		}.bind(this))
			.catch(ERROR);
	}

	/*
	 * Get the list of commands.
	 */
	get commands() {
		return this.plugins.reduce(
			(p, c) => p.concat(c.plugin.commands),
			[]);
	}

	/*
	 * Functions for queueing messages. Used to help prevent rate limiting.
	 */
	sendMessage() {
		return this.pushQueue({
			func: this.client.sendMessage.bind(this.client),
			args: arguments
		});
	}
	updateMessage() {
		return this.pushQueue({
			func: this.client.updateMessage.bind(this.client),
			args: arguments
		});
	}
	deleteMessage() {
		return this.pushQueue({
			func: this.client.deleteMessage.bind(this.client),
			args: arguments
		});
	}
	sendFile() {
		return this.pushQueue({
			func: this.client.sendFile.bind(this.client),
			args: arguments
		});
	}
	reply() {
		return this.pushQueue({
			func: this.client.reply.bind(this.client),
			args: arguments
		});
	}

	/*
	 * Pushes to the queue.
	 *
	 * @param request The request to add to the queue.
	 *
	 * @return A Promise that resolves when the request is completed.
	 */
	pushQueue(request) {
		return new Promise((resolve, reject) => {
			// Add callbacks to the request.
			request.resolve = val => {
				resolve(val);
			};
			request.reject = err => {
				reject(err);
			};

			// Add the request to the queue.
			this.queue.push(request);

			// If the item is the only item in the queue, execute it.
			if (this.queue.length == 1) {
				this.executeQueue();
			}
		});
	}

	/*
	 * Executes the entire queue.
	 *
	 * @return A Promise that resolves after the request goes through.
	 */
	executeQueue() {
		return new Promise((resolve, reject) => {
			// If the queue is empty, return.
			if (this.queue.length == 0) return;

			// Get the first item.
			const request = this.queue[0];

			// Execute it.
			request.func.apply(this, request.args)
				.then(result => {
					request.resolve(result);

					// Remove the request from the queue.
					this.queue.shift();

					// Move onto the next one.
					this.executeQueue().then(resolve).catch(reject);
				})
				.catch(err => {
					if (err.status === 429) {
						// Intercept rate limit errors.
						const retry = err.response.header['retry-after'];
						setTimeout(() => {
							// Try again.
							this.executeQueue().then(resolve).catch(reject);
						}, retry);
					} else {
						// Throw everything else.
						request.reject(err);
						ERROR(err);

						// Remove the request from the queue.
						this.queue.shift();

						// Move onto the next one.
						this.executeQueue().then(resolve).catch(reject);
					}
				});
		});
	}

	/*
	 * Create a database model.
	 *
	 * @param collection The collection name.
	 *
	 * @return A Mongorito model.
	 */
	createModel(collection) {
		// Make sure a database connection is established.
		if (this.db) {
			const db = this.db;

			// Return the model.
			return class extends Model {
				db() { return db; }
				collection() { return collection; }

				/*
				 * Grab the entry for a specific server.
				 *
				 * @param id The id of the server.
				 * @param def The default value.
				 *
				 * @return A Promise that resolves to the entry.
				 */
				static forServer(id, def) {
					return co(function*() {
						const entries = yield this.limit(1).find({
							'server': id
						});
						if (entries.length == 0) {
							return new this({
								'server': id,
								'val': def
							});
						} else {
							return entries[0];
						}
					}.bind(this));
				}

				set val(value) { this.set('val', value); }
				get val() { return this.get('val'); }
			}
		} else {
			throw new Error('No database connection.');
		}
	}

}

module.exports = Bot;
