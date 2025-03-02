const { join } = require('path');
const { readdirSync } = require('fs');

module.exports = (client) => {
    const eventsPath = join(__dirname, '..', 'events');
    const eventFiles = readdirSync(eventsPath).filter((file) => file.endsWith('.js'));

    for (const file of eventFiles) {
        const eventPath = join(eventsPath, file);
        const event = require(eventPath);

        if (event.once) client.once(event.name, (...args) => event.execute(...args, client));   
        else client.on(event.name, (...args) => event.execute(...args, client));
    }
}