const { MessageFlags } = require("discord.js");

module.exports = {
    name: 'interactionCreate',
    execute(interaction, client) {
        if (interaction.isChatInputCommand()) {
            if (!client.commands.has(interaction.commandName)) return interaction.reply({
                content: 'Une erreur est survenue lors de l\'exécution de la commande. Merci de contacter le support.',
                flags: MessageFlags.Ephemeral
            })

            const command = client.commands.get(interaction.commandName);

            command.execute(interaction, client);
        }
    }
}