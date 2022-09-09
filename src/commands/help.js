const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('help me :O'),
	async execute(interaction) {
        const helpEmbed = {
            title: "Help",
            description: "**Misc**\n`help` `ping` `whoami` `resources`\n\n**EXCO**\n`edit` `pizza` `add_resource` `add_session`",
            color: 0xe06183,
            footer: {
                text: "You have been helped"
            }
        }
        await interaction.reply({embeds: [helpEmbed]});
	}
};
