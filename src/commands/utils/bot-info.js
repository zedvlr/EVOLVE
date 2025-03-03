const { EmbedBuilder } = require("@discordjs/builders");
const { SlashCommandBuilder } = require("discord.js");
const { version } = require('../../../package.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('bot-info')
        .setDescription('Affiche les informations concernant le bot'),
    execute(interaction, client) {
        const uptime = {
            hours: Math.floor(client.uptime / 60**3),
            minutes: Math.floor(client.uptime / 60**2),
            seconds: Math.floor(client.uptime / 60)
        };

        interaction.reply({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Informations')
                    .setAuthor({
                        name: client.user.tag,
                        iconURL: client.user.displayAvatarURL({ dynamic: true })
                    })      
                    .addFields({
                        name: 'ID :',
                        value: client.user.id
                    }, {
                        name: 'Version :',
                        value: version
                    }, {
                        name: 'Serveurs :',
                        value: `${client.guilds.cache.size}`
                    }, {
                        name: 'Membres :',
                        value: `${client.users.cache.size}`
                    }, {
                        name: 'Uptime',
                        value: `${uptime.hours} heures, ${uptime.minutes} minutes et ${uptime.seconds} secondes`
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