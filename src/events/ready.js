const { ActivityType } = require("discord.js");

module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity("you", { type: ActivityType.Watching });
		const risacserver = await client.guilds.fetch("861574538823335936"); // this is for caching purposes
		const serverMembers = await risacserver.members.fetch();
	},
};