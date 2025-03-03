const { ActivityType, Message } = require('discord.js');
const User = require('../models/User');

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

            client.guilds.cache.forEach((guild) => {
                guild.members.cache.forEach(async (member) => {
                    let user = await User.findOne({ id: member.id, guildId: guild.id });

                    if (!user) {
                        user = new User({ id: member.id, guildId: guild.id });
                    }

                    user.voiceTime++;

                    user.save();
                });
            });
        }, 60000);
    }
}