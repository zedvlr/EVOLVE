const Guild = require('../models/Guild');

module.exports = {
    name: 'guildMemberAdd',
    async execute(member) {   
        const placeholders = {
            '{member}': member,
            '{server}': member.guild.name,
            '{member-count}': member.guild.memberCount
        };
        
        const guildData = await Guild.findOne({ id: member.guild.id });

        if (guildData && guildData.welcomeChannel && member.guild.channels.cache.has(guildData.welcomeChannel) && guildData.welcomeMessage) {
            const channel = member.guild.channels.cache.get(guildData.welcomeChannel);

            let message = guildData.welcomeMessage;

            Object.entries(placeholders).forEach(([key, value]) => {
                message = message.replace(new RegExp(key, 'g'), value);
            });

            channel.send(message).catch(() => {});
        }

        if (guildData.welcomeRole && member.guild.roles.cache.has(guildData.welcomeRole)) {
            member.roles.add(guildData.welcomeRole).catch(() => {});
        }
    }
}