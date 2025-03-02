const { MessageFlags, ChannelType, PermissionFlagsBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
const Guild = require('../models/Guild');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            if (!client.commands.has(interaction.commandName)) return interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de la commande. Merci de contacter le support.',
                flags: MessageFlags.Ephemeral
            })

            const command = client.commands.get(interaction.commandName);

            command.execute(interaction, client);
        } else if (interaction.isButton()) {
            switch (interaction.customId) {
                case 'open-ticket':

                    let guildData = await Guild.findOne({ id: interaction.guild.id });

                    if (guildData.tickets.find((ticket) => ticket.user === interaction.user.id)) return interaction.reply({
                        content: 'Vous ne pouvez créer qu\'un seul ticket à la fois !',
                        flags: MessageFlags.Ephemeral
                    })

                    if (!guildData) {
                        guildData = new Guild({ id: interaction.guild.id });
                    }

                    try {
                        if (!guildData.ticketParent) {
                            const ticketParent = await interaction.guild.channels.create({
                                name: 'tickets',
                                type: ChannelType.GuildCategory,
                                permissionOverwrites: [{
                                    id: interaction.guild.roles.everyone.id,
                                    deny: PermissionFlagsBits.ViewChannel
                                }, {
                                    id: client.user.id,
                                    allow: PermissionFlagsBits.ViewChannel
                                }]
                            });

                            guildData.ticketParent = ticketParent.id;

                            if (guildData.modRole && interaction.guild.roles.cache.has(guildData.modRole)) {
                                await ticketParent.permissionOverwrites.edit(guildData.modRole, {
                                    ViewChannel: true
                                });
                            }
                        }

                        const ticketCount = guildData.tickets.length;

                        const ticket = await interaction.guild.channels.create({
                            name: `ticket-${ticketCount + 1}`,
                            parent: guildData.ticketParent,
                            permissionOverwrites: [{
                                id: interaction.guild.roles.everyone.id,
                                deny: PermissionFlagsBits.ViewChannel
                            }]
                        });

                        if (guildData.modRole && interaction.guild.roles.cache.has(guildData.modRole)) {
                            await ticket.permissionOverwrites.edit(guildData.modRole, {
                                ViewChannel: true
                            });
                        }

                        await ticket.send({
                            embeds: [
                                new EmbedBuilder()
                                    .setTitle(`Ticket-${ticketCount + 1}`)
                                    .setTimestamp()
                                    .setDescription(`Bienvenue dans votre ticket ${interaction.user}\nLe support va vous prendre en charge le plus vite possible\nEn attendant, veuillez décrire votre problème le plus en détails possible`)
                                    .setFooter({
                                        text: 'Merci de ne pas mentionner le staff'
                                    })
                            ],
                            components: [
                                new ActionRowBuilder()
                                    .addComponents(
                                        new ButtonBuilder()
                                            .setCustomId('close-ticket')
                                            .setEmoji('🔒')
                                            .setLabel('Fermer le ticket')
                                            .setStyle(ButtonStyle.Danger)
                                    )
                            ]
                        });

                        interaction.reply({
                            content: `Votre ticket a été crée : ${channel}`,
                            flags: MessageFlags.Ephemeral
                        });

                        guildData.tickets.push({
                            user: interaction.user.id,
                            channel: ticket.id
                        });

                        guildData.save();
                    } catch (err) {
                        interaction.reply({
                            content: 'Erreur lors de l\'ouverture du ticket ! Merci de contacter un administrateur.',
                            flags: MessageFlags.Ephemeral
                        });
                        console.log(err);
                    }

                    break;

                case 'close-ticket':
                    guildData = await Guild.findOne({ id: interaction.guild.id });

                    const member = interaction.guild.members.cache.get(interaction.user);

                    if (!guildData.modRole || !interaction.guild.roles.cache.has(guildData.modRole) || !member.roles.has(guildData.modRole) && member.permissions.has(PermissionFlagsBits.ManageMessages)) return interaction.reply({
                        content: 'Seuls les modérateurs peuvent effectuer cette action !',
                        flags: MessageFlags.Ephemeral
                    });

                    const ticket = guildData.tickets.find((ticket) => ticket.channel === interaction.channel.id);
                    const ticketIndex = guildData.tickets.indexOf(ticket);

                    guildData.tickets.splice(ticketIndex, ticketIndex);

                    guildData.save();

                    break;
            }
        }
    }
}