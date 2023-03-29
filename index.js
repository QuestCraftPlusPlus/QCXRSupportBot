const fs = require('fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits, Routes, Events, Interaction,EmbedBuilder, Embed, ActivityType  } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { config } = require('dotenv');
config();
const Token = process.env.token;
const ClientID = process.env.clientID;
const GuildID = process.env.guildID;
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
const commands = [];
const { SlashCommandBuilder, StringSelectMenuBuilder } = require('discord.js');
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    console.log(command);
    client.commands.set(command.data.name, command);
}


for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
}

rest = new REST({version: '10'}).setToken(Token);

client.on("rateLimit", function (rateLimitData) {
    console.log(`the rate limit has been hit!`);
    console.log({ rateLimitData });
});

rest.put(Routes.applicationGuildCommands(ClientID, GuildID), { body: commands })
    .then(() => console.log('Successfully registered application commands with no errors! Your slash commands are working!'))
    .catch(console.error);

client.on('interactionCreate', async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);
    if (!command) return;
    try {
        await command.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'Oof! (ERROR) Contact <@317814254336081930>!', ephemeral: true });
    }
});

client.login(Token);

client.on("ready", function () {
    console.log(`I am ready! Logged in as ${client.user.tag}!`);

    client.user.setPresence({
        activities: [{ name: `Testing GPT4 :pog:`, type: ActivityType.Watching }],
        status: 'online',
      });
});

client.once('ready', () => {
    console.log('Ready!');
});
