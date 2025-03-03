const User = require('../models/User');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (!message.member || message.author.bot) return;

        if (message.content.includes('<@1318266861003210822>')) {
            message.reply('Mon préfixe est `/`, tapez `/help` pour plus d\'informations;');
        }

        let user = await User.findOne({ id: message.author.id, guildId: message.guild.id });

        if (!user) {
            user = new User({ id: message.author.id, guildId: message.guild.id });
        }

        user.messageCount++;

        user.save();
    }
}