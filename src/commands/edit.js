const { SlashCommandBuilder, ButtonStyle, EmbedBuilder } = require("discord.js");
const { isEXCO, buttonrow, writememberJSON, isDeleted } = require("../misc/functions.js");
const { embedColor, successColor } = require("../publicConfig.json");
const { memberObj } = require("../misc/classes.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("edit")
        .setDescription("Edit someone else's information (or simply view it)")
        .addUserOption(option => option.setName('user').setDescription('User to view information of').setRequired(true))
        .addStringOption(option => option
            .setName("variable")
            .setDescription("What variable to change (Leave this empty if you are just viewing information)")
            .addChoices(
                { name: "name", value: "name" },
                { name: "class", value: "class" },
                { name: "email", value: "email" },
                { name: "phone number", value: "phone" },
                { name: "discord ID", value: "ID" },
                { name: "pizza points", value: "pizza"}
        ))
        .addStringOption(option => option
            .setName("value")
            .setDescription("New value (optional) ")
        ),

    async execute(interaction) {
        if (!isEXCO(interaction, interaction.user)) { await interaction.reply({ content: "lmao you tried, u need to be exco to use this smh my head", ephemeral: true }); return; }
        const target = interaction.options.getUser("user");
        const person = memberObj[String(target.id)];
        if (person == undefined) {
            await interaction.reply({content: "This person has not set up their account yet.", ephemeral: true});
            return;
        }

        const exprofileEmbed = {
            title: `Name: ${person["name"]}`,
            description: `Class: \`${person["class"]}\`\nEmail: \`${person["email"]}@student.ri.edu.sg\`\nPhone Number: \`${person["phone"]}\`\nPizza: \`${person["pizza"]}\``,
            author: {
                name: target.username,
                url: "",
                icon_url: target.displayAvatarURL()
            },
            color: Number(embedColor),
            footer: {
                text: `ID: ${target.id}`
            }
        }

        const yesNo = buttonrow(
            { id: "yes", label: "Yes", style: ButtonStyle.Success},
            { id: "no", label: "No", style: ButtonStyle.Danger}
        )
        const variable = interaction.options.getString("variable");
        const newValue = interaction.options.getString("value");
        
        if (variable == undefined && newValue == undefined) {
            await interaction.reply({ embeds: [exprofileEmbed], ephemeral: true });
        } else if (variable == undefined) {
            await interaction.reply({ content: "man u think ur very funny giving me a value without a variable", ephemeral: true })
        } else if (newValue == undefined) {
            await interaction.reply({ content: "Give me a new value pls", ephemeral: true })
        } else {
            const replyMessage = await interaction.reply({ content: `Are you sure you want to change <@${target.id}>'s \`${variable}\` to \`${newValue}\`?`, components: [yesNo], fetchReply: true });
            const collector = replyMessage.createMessageComponentCollector({ time: 15000 });
            collector.on('collect', async i => {
                if (i.user.id != interaction.user.id) {
                    await i.reply( {content: "This button isn't for you, go away smh my head", ephemeral: true } );
                } else if (i.customId == "yes") {
                    collector.stop();
                    if (variable == "pizza") {
                        try {
                            memberObj[String(target.id)][variable] = Number(newValue);
                        } catch (err) {
                            console.log(err);
                        }
                    } else {
                        memberObj[String(target.id)][variable] = newValue;
                    }
                    await i.reply( {embeds: [new EmbedBuilder().setTitle("Process successful").setColor(successColor)]} );
                    writememberJSON(memberObj);
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
}