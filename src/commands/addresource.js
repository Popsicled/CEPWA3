const { SlashCommandBuilder } = require("discord.js");
const { Resources, Resource } = require("../misc/classes");
const { writeresourceJSON, isEXCO, isISOdate } = require("../misc/functions");
const { resourceJSON } = require("../updatedresources.json");
const { sessions } = require("../updatedsessions.json")

module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_resource")
        .setDescription("Add a new resource")
        .addStringOption(option => option
            .setName("date")
            .setDescription("Date of session in ISO format (for example, 2020-29-02)")
            .setRequired(true))
        .addStringOption(option => option
            .setName("link")
            .setDescription("Link to the resource")
            .setRequired(true))
        .addStringOption(option => option
            .setName("type")
            .setDescription("Type of the resource, e.g. slides, star charts")
            .setRequired(true)),
    
    async execute(interaction) {
        if (!isEXCO(interaction, interaction.user)) { await interaction.reply({ content: "You need to be EXCO to use this lol", ephemeral: true}); return; }
        if (!isISOdate(interaction.options.getString("date"))){ await interaction.reply({content: "Invalid date", ephemeral: true}); return; }
        // session not created
        if (sessions[interaction.options.getString("date")] == undefined) { await interaction.reply({ content: "A session has not been created yet. Create one using `/add_session`!", ephemeral: true}); return; }
        
        await interaction.deferReply();
        // appends the new resource to the array of resources
        resourceJSON.push(new Resource(interaction.options.getString("link"), interaction.options.getString("date"), interaction.options.getString("type")));
        // writes the array to a file
        writeresourceJSON(new Resources(resourceJSON));
        await interaction.editReply("New resource created!");
    }
}