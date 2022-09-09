const { SlashCommandBuilder, ButtonStyle } = require("discord.js");
const { sessions } = require("../updatedsessions.json");
const fs = require("node:fs");
const { buttonrow, isDeleted, isEXCO, isISOdate } = require("../misc/functions");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("add_session")
        .setDescription("Add a new session")
        .addStringOption(option => option
            .setName("date")
            .setDescription("Date of session in ISO format (for example, 2022-29-02)")
            .setRequired(true))
        .addStringOption(option => option
            .setName("subject")
            .setDescription("Subject")
            .addChoices(
                { name: 'Astronomy', value: 'astro'},
                { name: "Physics", value: "phys"},
                { name: "Chemistry", value: "chem"},
                { name: "Biology", value: "bio"},
                { name: "Others", value: "others"}
            )
            .setRequired(true))
        .addStringOption(option => option
            .setName("title")
            .setDescription("Title of the session")
            .setRequired(true)),


    async execute(interaction) {
        if (!isEXCO(interaction, interaction.user)) { await interaction.reply({ content: "You need to be EXCO to use this lol", ephemeral: true}); return; }
        if (!isISOdate(interaction.options.getString("date"))) { await interaction.reply({content: "Invalid date", ephemeral: true}); return; }
        
        // just a function that reduces the number of lines of code, though it barely makes a difference
        function updateSessions() {
            sessions[interaction.options.getString("date")] = { subject: interaction.options.getString("subject"), title: interaction.options.getString("title") };
            fs.writeFileSync('updatedsessions.json', `{ "sessions": ${JSON.stringify(sessions)} }`);
        }

        if (sessions[interaction.options.getString("date")] != undefined) {
            // session already exists
            const yesNo = buttonrow(
                { id: "yes", label: "Yes", style: ButtonStyle.Success},
                { id: "no", label: "No", style: ButtonStyle.Danger}
            )
            const replyMessage = await interaction.reply( { content: "A session on that date already exists. Replace?", components: [yesNo], fetchReply: true});
            const collector = replyMessage.createMessageComponentCollector({ time: 15000 });
            
            collector.on('collect', async i => {
                if (i.user.id != interaction.user.id) {
                    await i.reply( {content: "This button isn't for you, go away smh my head", ephemeral: true } );
                } else if (i.customId == "no") {
                    collector.stop();
                    await i.reply( { content: "", embeds: [new EmbedBuilder().setTitle("Cancelled").setColor(embedColor)] });
                } else {
                    updateSessions();
                    await i.reply("New session created! You may now add resources to this session. **If you do not add any resources to this session, it will not be visible when `/resources` is run**");
                }
            });

            collector.on('end', async (collected, reason) => {
                if (isDeleted(reason)) return;
                yesNo.components[0].setDisabled(true);
                yesNo.components[1].setDisabled(true);
                await replyMessage.edit({ components: [yesNo] });
            })

        } else {
            await interaction.deferReply();
            updateSessions();
            await interaction.editReply("New session created! You may now add resources to this session. **If you do not add any resources to this session, it will not be visible when `/resources` is run**");
        }
    }
}