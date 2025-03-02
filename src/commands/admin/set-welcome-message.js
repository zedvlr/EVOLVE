const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome-message')
        .setDescription('Modifie le message de bienvenue')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addStringOption(option =>
            option
                .setName('message')
                .setDescription('Le nouveau message de bienvenue')
                .setRequired(true)
        ),
    async execute(interaction) {
        const message = interaction.options.getString('message');

        let guildData = await Guild.findOne({ id: interaction.guild.id });

        if (!guildData) {
            guildData = new Guild({ id: interaction.guild.id });
        }

        guildData.welcomeMessage = message;

        guildData.save();

        interaction.reply(`Le message de bienvenue a été redéfinie : **${message}**`);
    }
}