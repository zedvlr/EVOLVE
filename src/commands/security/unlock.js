const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unlock')
        .setDescription('Dévérouille le salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: null
            });
            interaction.reply('Le salon a été dévérouillé.');
        } catch {
            interaction.reply({
                content: 'Erreur lors du dévérouillage du salon ! Merci de vérifier mes permissions.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}