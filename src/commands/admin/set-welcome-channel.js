const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome-channel')
        .setDescription('Modifie le salon de bienvenue')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addChannelOption(option =>
            option
                .setName('channel')
                .setDescription('Le nouveau salon de bienvenue')
                .setRequired(true)
        ),
    async execute(interaction) {
        const channel = interaction.options.getChannel('channel');

        let guildData = await Guild.findOne({ id: interaction.guild.id });

        if (!guildData) {
            guildData = new Guild({ id: interaction.guild.id });
        }

        guildData.welcomeChannel = channel.id;

        guildData.save();

        interaction.reply(`Le salon de bienvenue a été redéfinie : ${channel}`);
    }
}