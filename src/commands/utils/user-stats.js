const { SlashCommandBuilder, MessageFlags } = require("discord.js");
const User = require('../../models/User');
const { EmbedBuilder } = require("@discordjs/builders");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-stats')
        .setDescription('Affiche les stats d\'un utilisateur')
        .addUserOption(option =>
            option
                .setName('user')
                .setDescription('L\'utilisateur dont vous voulez afficher les stats')
                .setRequired(false)
        ),
    async execute(interaction) {
        const user = interaction.options.getUser('user') || interaction.user;

        const userData = await User.findOne({ id: user.id, guildId: interaction.guild.id });

        if (!userData) return interaction.reply({
            content: 'Aucune donnée trouvée pour cet utilisateur.',
            flags: MessageFlags.Ephemeral
        });

        const voiceTime = {
            hours: Math.floor(userData.voiceTime / 60),
            minutes: userData.voiceTime % 60
        };
        
        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Stats')
                    .setAuthor({
                        name: user.username,
                        iconURL: user.displayAvatarURL({ dynamic: true })
                    })
                    .addFields({
                        name: 'Messages :',
                        value: `${userData.messageCount}`
                    }, {
                        name: 'Activité vocale :',
                        value: `${voiceTime.hours} heures et ${voiceTime.minutes} minutes`
                    })
            ]
        })
    }
}