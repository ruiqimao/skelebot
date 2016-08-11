# Skelebot

## Introduction
This is a barebones Discord bot, based off the [discord.js](https://github.com/hydrabolt/discord.js/) library. It includes the basic features of a Discord bot:
* Login through bot token or email/password combination.
* Optional MongoDB connectivity.
* Modular plugin system.
* Ability to dynamically load and unload said plugins.
* Example code to help you get started.

## Setup
Edit the `src/authorization.json` file as such:
```javascript
{
    "token": "<DISCORD BOT TOKEN>",
    "email": "<DISCORD EMAIL ADDRESS>",
    "password": "<DISCORD PASSWORD>",

    "mongo_uri": "<MONGO_DB_URI>",

    "owners": [
        "<USER IDS OF BOT OWNERS>"
        ...
    ]
}
```
Note that only either the token or the email/password combination is needed. The code will take the token over the email/password combination if both are provided.

The `mongo_uri` field can be left blank if no database connectivity is needed. Otherwise, the field should be filled in with the format `mongodb://<LOCATION>/<DATABASE NAME>`.

The owners list is recommended (but not required), since having your user ID there will give you access to administrative bot commands, such as reloading plugins.

## Configuration
Edit the `src/bot/config.js` file as such:
```javascript
module.exports = {

    PREFIX: '<COMMAND PREFIX>',

    PLUGINS: [
        'utils',
        ...
    ]

}
```

The `PREFIX` field is required, since the bot will have a prefix ("!", "+", "-", "?", etc.) before all the commands.

The `PLUGINS` list is a list of all plugins that are enabled by default when the bot starts, with each name corresponding to a folder name in `src/bot/plugins`. It is recommended (but not required) to leave the `utils` plugin in, since it will give access to administrative commands, as well as the help command.

## Getting Started
Run `npm install` to install all the dependencies.

To get started with writing plugins, look at the example code in `src/bot/plugins/template`.

## Running
To run the bot, after doing all setup, configuration, and installation necessary, run `node entry.js` to start the bot.

## Questions?
The code is provided AS IS. Any questions regarding Skelebot and how to use it can be directed to ruiqim@gmail.com, although response is not guaranteed.
