module.exports = {
	name: 'ready',
	once: true,
	async execute(client) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
		client.user.setActivity('you', { type: 'WATCHING' });
		const risacserver = await client.guilds.fetch("861574538823335936");
		const serverMembers = await risacserver.members.fetch();
	},
};