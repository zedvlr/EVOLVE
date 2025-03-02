const { SlashCommandBuilder, PermissionFlagsBits, ChannelType, ButtonStyle, MessageFlags } = require('discord.js');
const Guild = require('../../models/Guild');
const { EmbedBuilder } = require('@discordjs/builders');
const { ActionRowBuilder } = require('@discordjs/builders');
const { ButtonBuilder } = require('@discordjs/builders');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ticket-setup')
        .setDescription('Met en place le système de ticket')
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
    async execute(interaction) {
        let guildData = await Guild.findOne({ id: interaction.guild.id });

        if (!guildData || !guildData.ticketParent) {
            guildData = new Guild({ id: interaction.guild.id });

            try {
                const ticketParent = await interaction.guild.channels.create({
                    name: 'tickets',
                    type: ChannelType.GuildCategory,
                    permissionOverwrites: [{
                        id: interaction.guild.roles.everyone.id,
                        deny: [PermissionFlagsBits.ViewChannel]
                    }]
                });

                if (guildData.modRole) {
                    ticketParent.permissionOverwrites.edit(guildData.modRole, {
                        ViewChannel: true
                    });
                }

                guildData.ticketParent = ticketParent.id;

                guildData.save();
            } catch {
                interaction.reply({
                    content: 'Erreur lors de la mise en place du système de ticket ! Merci de vérifier mes permissions.',
                    flags: MessageFlags.Ephemeral
                });
            }
                
        }

        interaction.channel.send({
            embeds: [
                new EmbedBuilder()
                    .setTitle('Tickets')
                    .setDescription('Cliquez sur le bouton ci-dessous pour ouvrir un ticket.')
            ],
            components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('open-ticket')
                            .setEmoji({ name: '🎟️' })
                            .setLabel('Ouvrir un ticket')
                            .setStyle(ButtonStyle.Primary)
                    )
            ]
        });

        interaction.reply({
            content: 'Le système de ticket a été mis en place !',
            flags: MessageFlags.Ephemeral
        })
    }
}