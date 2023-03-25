const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations({
            PortugueseBR:'ping',
            fr:'ping'
        })
        .setDescription('Replies with Pong!')
        .setDescriptionLocalizations({
            PortugueseBR:'Responde com pong!',
            fr:'Reponds avec Pong!'
        })
        .addBooleanOption(option =>
            option.setName('secret')
                .setNameLocalizations({
                    PortugueseBR:'segredo',
                    fr:'caché'
                })
                .setDescription('only you can see result?'))
                .setDescriptionLocalizations({
                    PortugueseBR:'segredo',
                    fr:'caché'
                }),
    async execute(interaction) {
        const isSecret = interaction.options.getBoolean('secret');
        await interaction.reply({content:'Pong!',ephemeral:isSecret});
    },
}