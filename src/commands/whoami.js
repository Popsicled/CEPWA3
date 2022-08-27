const { SlashCommandBuilder } = require('@discordjs/builders');
const fs = require("fs");
const { members } = require("../info.json");

module.exports = {
	data: new SlashCommandBuilder()
		.setName('whoami')
		.setDescription('Who am I???'),
	async execute(interaction) {
        var name = "???";
        var class1 = "???";
        var role = "???";
        for (var i = 0; i<members.length; i++) {
            if (members[i]["ID"] == String(interaction.user.id)) {
                name = members[i]["Name"];
                class1 = members[i]["Class"];
            }
        }
        const profileEmbed = {
            title: `Name: ${name}`,
            description: `Class: ${class1}\nRole: ${role}`,
            author: {
                name: interaction.user.username,
                url: "",
                icon_url: interaction.user.displayAvatarURL()
            },
            color: 0xe06183,
            footer: {
                text: `ID: ${interaction.user.id}`
            }
        }
		if (interaction.guild.id == 861574538823335936 || interaction.user.id == 639049378937700352){
            await interaction.reply({embeds: [profileEmbed]});
        } else {
            await interaction.reply({content:"This feature is not available in this server", ephemeral:true})
        }
	}
};
