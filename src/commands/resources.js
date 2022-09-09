const { SlashCommandBuilder, ActionRowBuilder, SelectMenuBuilder } = require("discord.js");
const { Resources, Resource } = require("../misc/classes.js");
const { isDeleted } = require("../misc/functions.js");
const { embedColor } = require("../publicConfig.json");
const { resourceJSON } = require("../updatedresources.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("resources")
        .setDescription("View past resources"),
    
    async execute(interaction) {
        let types = [];
        let resourceArr = {
            title: "Resources",
            description: (new Resources(resourceJSON)).toString(types),
            color: Number(embedColor)
        }
        let subjects = new ActionRowBuilder()
            .addComponents(
                new SelectMenuBuilder()
                    .setCustomId('subjects')
                    .setPlaceholder('All')
                    .setMinValues(0)
                    .setMaxValues(5)
                    .addOptions([
                        { label: 'Astronomy', value: 'astro'},
                        { label: "Physics", value: "phys"},
                        { label: "Chemistry", value: "chem"},
                        { label: "Biology", value: "bio"},
                        { label: "Others", value: "others"}
                    ])
            )


        const replyMessage = await interaction.reply({embeds: [resourceArr], components: [subjects], fetchReply: true});
        const collector = replyMessage.createMessageComponentCollector({ time: 30000 });

        collector.on('collect', async i => {
            if (i.user.id != interaction.user.id) { await i.reply( {content: "This isn't for you >:(", ephemeral: true } ); return; }
            // redeclared to update the message based on the options provided. If this is not done, the options selected will disappear when the message is edited
            resourceArr = {
                title: "Resources",
                description: (new Resources(resourceJSON)).toString(i.values),
                color: Number(embedColor)
            }
            subjects = new ActionRowBuilder()
                .addComponents(
                    new SelectMenuBuilder()
                        .setCustomId('subjects')
                        .setPlaceholder('All')
                        .setMinValues(0)
                        .setMaxValues(5)
                        .addOptions([
                            { label: 'Astronomy', value: 'astro', default: i.values.includes('astro')},
                            { label: "Physics", value: "phys", default: i.values.includes('phys')},
                            { label: "Chemistry", value: "chem", default: i.values.includes('chem')},
                            { label: "Biology", value: "bio", default: i.values.includes('bio')},
                            { label: "Others", value: "others", default: i.values.includes('others')}
                        ])
                )
            await i.update({ embeds: [resourceArr], components: [subjects] });
        })

        collector.on('end', async (collected, reason) => {
            if (isDeleted(reason)) return;
            subjects.components[0].setDisabled();
            await replyMessage.edit({ components: [subjects]});
        })
    }
};