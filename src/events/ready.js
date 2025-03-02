const { ActivityType } = require('discord.js');

require('colors');

module.exports = {
    once: true,
    name: 'ready',
    execute(client) {
        console.log(`Successfully logged in as ${client.user.tag}!`.yellow);

        const statuses = [
            `${client.guilds.cache.size} serveurs`,
            `${client.users.cache.size} membres`,
            '/help'
        ];

        let i = 0;

        setInterval(() => {
            client.user.setActivity(statuses[i], { type: ActivityType.Watching });
            i = ++i % statuses.length;
        }, 60000);
    }
}