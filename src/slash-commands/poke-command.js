const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poke')
        .setDescription('Poke someone specified'),
    async execute(interaction) {
        //interaction.
        await interaction.reply('poke!');
    },
}