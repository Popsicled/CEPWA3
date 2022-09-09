const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { isEXCO } = require('./misc/functions');


let token = '';
if (fs.existsSync('./config.json')) { // an environmental variable will be used in place of the ./config.json file on Heroku, so this is done to prevent errors
    const { botToken } = require('./config.json');
	token = botToken;
} else {
	token = process.env.token;
}
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildEmojisAndStickers]});

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	client.commands.set(command.data.name, command);
}


const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
	const filePath = path.join(eventsPath, file);
	const event = require(filePath);
	if (event.once) {
		client.once(event.name, (...args) => event.execute(...args));
	} else {
		client.on(event.name, (...args) => event.execute(...args));
	}
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isChatInputCommand()) return; // interaction is not a command
	const command = client.commands.get(interaction.commandName);

	if (!command) return; // command file does not exist
	if ((interaction.guild == null || interaction.guild.id != "861574538823335936") && !isEXCO(interaction, interaction.user)) { await interaction.reply({ content: "This bot can only be used on the RISAC server", ephemeral: true }); return; }
	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command. If this happens multiple times, please contact the dev', ephemeral: true });
	}
});


client.login(token);