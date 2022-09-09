const { SlashCommandBuilder, AttachmentBuilder } = require("discord.js");
const { isEXCO } = require("../misc/functions");
const { execute } = require("./help");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("export")
        .setDescription("Exports all necessary files to attachments"),
    
    async execute(interaction) {
        if (!isEXCO(interaction, interaction.user)) {
            await interaction.reply({ content: "Only exco can use this hehe", ephemeral: true });
        } else {
            await interaction.reply({ files: [new AttachmentBuilder("updatedinfo.json").setName("info"), new AttachmentBuilder("updatedresources.json").setName("resources"), new AttachmentBuilder("updatedsessions.json").setName("sessions")] });
        }
    }
}