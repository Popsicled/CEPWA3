const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Pong'),

	async execute(interaction) {
		pingingEmbed = new EmbedBuilder().setTitle('Pinging...')
		const sent = await interaction.reply({embeds: [pingingEmbed], fetchReply: true});
        const pingEmbed = {
            timestamp: new Date(),
            title: "Pong :ping_pong:",
            description: `Websocket Latency: \`${interaction.client.ws.ping}ms\`\nRoundtrip Latency: \`${sent.createdTimestamp - interaction.createdTimestamp}ms\`\nTotal Latency: \`${interaction.client.ws.ping + sent.createdTimestamp - interaction.createdTimestamp}ms\``,
            author: {
                name: interaction.user.username,
                url:"",
                icon_url: interaction.user.displayAvatarURL()
            },
            color: 0xe06183
        }
		interaction.editReply({embeds: [pingEmbed]})
	},
};
