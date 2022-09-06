const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help me :O'),
	async execute(interaction) {
        const helpEmbed = {
            title: "Help",
            description: "**Misc**\n`help` `ping` `whoami`",
            color: 0xe06183,
            footer: {
                text: "You have been helped"
            }
        }
        interaction.reply({embeds: [helpEmbed]});
	}
};
