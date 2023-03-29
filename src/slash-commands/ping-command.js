const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setNameLocalizations({
            "pt-BR":'ping',
            fr:'ping'
        })
        .setDescription('Replies with Pong!')
        .setDescriptionLocalizations({
            "pt-BR":'Responde com pong!',
            fr:'Reponds avec Pong!'
        })
        .addBooleanOption(option =>
        option.setName('secret')
            .setNameLocalizations({
                "pt-BR":'segredo',
                fr:'caché'
            })
            .setDescription('only you can see result?'))
            .setDescriptionLocalizations({
                "pt-BR":'segredo',
                fr:'caché'
            }),
    async execute(interaction) {
        const isSecret = interaction.options.getBoolean('secret');
        await interaction.reply({content:'Pong!',ephemeral:isSecret});
    },
}