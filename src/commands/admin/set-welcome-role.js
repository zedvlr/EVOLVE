const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const Guild = require('../../models/Guild');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-welcome-role')
        .setDescription('Modifie le rôle de bienvenue')
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .addRoleOption(option =>
            option
                .setName('role')
                .setDescription('Le nouveau rôle de bienvenue')
                .setRequired(true)
        ),
    async execute(interaction) {
        const role = interaction.options.getRole('role');

        let guildData = await Guild.findOne({ id: interaction.guild.id });

        if (!guildData) {
            guildData = new Guild({ id: interaction.guild.id });
        }

        guildData.welcomeRole = role.id

        guildData.save();

        interaction.reply(`Le rôle de bienvenue a été redéfinie : ${role}`);
    }
}