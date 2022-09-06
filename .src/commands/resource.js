const { SlashCommandBuilder } = require("discord.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resource")
        .setDescription("View past resources"),
    
    async execute(interaction) {
        interaction.reply({content: "WIP", ephemeral: true});
    }
};