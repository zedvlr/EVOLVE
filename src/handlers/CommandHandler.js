const { Collection } = require('discord.js');
const { join } = require('path');
const { readdirSync } = require('fs');
require('colors');

module.exports = (client) => {
    client.commands = new Collection();

    const commandDirsPath = join(__dirname, '..', 'commands');
    const commandDirs = readdirSync(commandDirsPath);

    for (const dir of commandDirs) {
        const commandsPath = join(commandDirsPath, dir);
        const commandFiles = readdirSync(commandsPath).filter((file) => file.endsWith('.js'));

        for (const file of commandFiles) {
            const commandPath = join(commandsPath, file);
            const command = require(commandPath);

            if ("data" in command && "execute" in command) {
                client.commands.set(command.data.name, command);
            } else {
                console.log(`[WARNING] Command at path ${commandPath} is missing required properties "data" or "execute"!`.yellow);
            }
        }
    }
}