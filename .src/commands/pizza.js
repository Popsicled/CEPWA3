const { SlashCommandBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { isEXCO, buttonrow, writeJSON, isDeleted } = require("../misc/functions.js");
const { embedColor, successColor } = require("../publicConfig.json");
const { memberObj } = require("../misc/classes.js");
const { membersEmail } = require("../info_members.json");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("pizza")
        .setDescription("give pizza to people")
        .addStringOption(option => option
            .setName("members")
            .setDescription("The login IDs of the members to give the pizza slices to (space-separated)")
            .setRequired(true)
        )
        .addIntegerOption(option => option
            .setName("value")
            .setDescription("How many pizza slices to give to each of the stated people")
            .setRequired(true)
        ),

    async execute(interaction) {
        if (!isEXCO(interaction, interaction.user)) { await interaction.reply({ content: "lmao you tried, u need to be exco to use this smh my head", ephemeral: true }); return; }

        const yesNo = buttonrow(
            { id: "yes", label: "Yes", style: ButtonStyle.Success},
            { id: "no", label: "No", style: ButtonStyle.Danger}
        )
        const memberList = interaction.options.getString("members").toLowerCase();
        const morepizza = interaction.options.getInteger("value");
        
        const replyMessage = await interaction.reply({ content: `Are you sure you want to change \`${memberList}\`'s pizza points by \`${morepizza}\`?`, components: [yesNo], fetchReply: true });
        const collector = replyMessage.createMessageComponentCollector({ time: 15000 });
        collector.on('collect', async i => {
            if (i.user.id != interaction.user.id) {
                await i.reply( {content: "This button isn't for you, go away smh my head", ephemeral: true } );
            } else if (i.customId == "yes") {
                collector.stop();
                memberList.split(' ').forEach(addpizza);
                
                function addpizza(member) {
                    memberObj[String(membersEmail[member]["ID"])].add(morepizza);
                }
                await i.reply( {embeds: [new EmbedBuilder().setTitle("Process successful").setColor(successColor)]} );
                writeJSON(memberObj);
            } else {
                collector.stop();
                await i.reply( { content: "", embeds: [new EmbedBuilder().setTitle("Process cancelled").setColor(embedColor)] });
            }
        });

        collector.on('end', async (collected, reason) => {
            if (isDeleted(reason)) return;
            yesNo.components[0].setDisabled(true);
            yesNo.components[1].setDisabled(true);
            await replyMessage.edit({ components: [yesNo] });
        })
    }
}