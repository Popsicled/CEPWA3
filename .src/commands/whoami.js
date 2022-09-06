const { SlashCommandBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const fs = require("fs");
const { dev } = require("../config.json");
const _ = require('lodash');
const exp = require('constants');
const { embedColor } = require('../publicConfig.json');
const { isEXCO, buttonrow, isDeleted } = require("../misc/functions.js");
const { members } = require("../updatedinfo.json");
const { memberObj } = require("../misc/classes.js");

module.exports = {
data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('Who am I???'),

	async execute(interaction) {
        let person = memberObj[String(interaction.user.id)];
        if (person == undefined) {
            await interaction.reply({content: "You have not set up your account yet. Please contact <@639049378937700352> to set it up", ephemeral: true});
            return;
        }
        const profileEmbed = { // normal embed
            title: `Name: ${person["name"]}`,
            description: `Class: \`${person["class"]}\`\nPizza: \`${person["pizza"]}\``,
            author: {
                name: interaction.user.username,
                url: "",
                icon_url: interaction.user.displayAvatarURL()
            },
            color: Number(embedColor),
            footer: {
                text: `ID: ${interaction.user.id}`
            }
        }

        const exprofileEmbed = { // embed when the user wants to view more
            title: `Name: ${person["name"]}`,
            description: `Class: \`${person["class"]}\`\nEmail: \`${person["email"]}@student.ri.edu.sg\`\nPhone Number: \`${person["phone"]}\`\nPizza: \`${person["pizza"]}\``,
            author: {
                name: interaction.user.username,
                url: "",
                icon_url: interaction.user.displayAvatarURL()
            },
            color: Number(embedColor),
            footer: {
                text: `ID: ${interaction.user.id}`
            }
        }

        const row = buttonrow(
            { id: "more", label: "More", style: ButtonStyle.Primary}
        );

        if (interaction.guild.id == "861574538823335936" || isEXCO(interaction, interaction.user)) {
            const replyMessage = await interaction.reply({embeds: [profileEmbed], components: [row], fetchReply: true});
            const collector = replyMessage.createMessageComponentCollector({ time: 15000 });
            
            collector.on('collect', async i => {
                if (i.user.id != interaction.user.id) {
                    await i.reply( {content: "Oi stop trying to look at other people's information", ephemeral: true } );
                } else if (i.customId == "more") {
                    collector.stop();
                    await i.reply( {embeds: [exprofileEmbed], ephemeral: true} );
                }
            });

            collector.on('end', async (collected, reason) => {
                if (isDeleted(reason)) return;
                row.components[0].setDisabled(true);
                await replyMessage.edit({ components: [row] });
            })
        } else {
            await interaction.reply({content:"This feature is not available in this server :(", ephemeral:true});
        }
	
     
    }


};
