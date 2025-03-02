const { SlashCommandBuilder, PermissionFlagsBits, MessageFlags } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lock')
        .setDescription('Vérouille le salon')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
    async execute(interaction) {
        try {
            await interaction.channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
                SendMessages: false
            });
            interaction.reply('Le salon a été vérouillé.');
        } catch {
            interaction.reply({
                content: 'Erreur lors du vérouillage du salon ! Merci de vérifier mes permissions.',
                flags: MessageFlags.Ephemeral
            });
        }
    }
}