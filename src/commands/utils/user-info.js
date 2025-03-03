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

        const embed = new EmbedBuilder()
            .setTitle('Informations')
            .setAuthor({
                name: client.user.tag,
                iconURL: client.user.displayAvatarURL({ dynamic: true })
            })  
            .addFields({
                name: 'ID :',
                value: user.id
            }, {
                name: 'Compte crée le :',
                value: user.createdAt
            }, {
                name: 'Serveur rejoint :',
                value: interaction.guild.members.cache.get(user).joinedAt
            })
            .setFooter({
                text: interaction.user.username,
                iconURL: interaction.user.displayAvatarURL({ dynamic: true })
            })
            .setTimestamp();

        if (userData) {
            const voiceTime = {
                hours: Math.floor(userData.voiceTime / 60),
                minutes: userData.voiceTime % 60
            };

            embed.addFields({
                name: 'Messages :',
                value: userData.messageCount
            }, {
                name: 'Activité vocale :',
                value: `${voiceTime.hours} heures et ${voiceTime.minutes} minutes`
            });
        }
        
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
                    .setFooter({
                        text: interaction.user.username,
                        iconURL: interaction.user.displayAvatarURL({ dynamic: true })
                    })
                    .setTimestamp()
            ]
        })
    }
}