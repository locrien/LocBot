const fs= require('node:fs');
const path = require('node:path');
const { Client, Collection, Events,  GatewayIntentBits } = require('discord.js');
var soundplayer = require('./soundplayer');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,] });

client.commands = new Collection();

const commandsPath =path.join(__dirname,'slash-commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const filePath = path.join(commandsPath, file);
  const command = require(filePath);

  if('data' in command && 'execute' in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
  }
}

const commands = [
  {
    commandPrefix: '!hello',
    description: 'Say hello',
    async execute(message, args) {
      //message.mentions.users.contains()
      message.channel.send(`Hello ${message.author}!`);
    },
  },
  {
    commandPrefix: '!ping',
    description: 'Ping the bot',
    async execute(message, args) {
      message.channel.send('Pong!');
    },
  },
  {
    commandPrefix: '!poke',
    description: 'Poke a person',
    async execute(message, args) {
      const guild = message.guild;
      const nickname = args.shift();

      const results = await guild.members.fetch({query: nickname, limit:1});
      console.log(`${results.first().id}`);

      message.channel.send(`${message.author} asked me to poke <@${results.first().id}> because they wont do it themselves.`);
    },
  },
  {
    commandPrefix: '!playaudio',
    description: 'play a sound file',
    async execute(message, args) {
      
      const filename = args.shift();

      if (!message.member.voice) {
        message.reply('You must be in a voice channel to use this command.');
        return;
      }

      soundplayer.playSoundM(message.member.voice, "testsound.mp3");
      //const results = await guild.members.fetch({query: nickname, limit:1});
      //console.log(`${results.first().id}`);

      //message.channel.send(`${message.author} asked me to poke <@${results.first().id}> because they wont do it themselves.`);
    },
  },
];

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('messageCreate', async message => {

  if (message.author.bot || !message.guild) return false;

  // Loop through commands array and call execute() method

  /*for (const command of commands) {
    if (message.content.startsWith(command.commandPrefix)) {
      const commandBody = message.content.slice(command.commandPrefix.length);
      const args = commandBody.trim().split(/ +/g);
      await command.execute(message, args);
      break;
    }
  } */
});

client.on(Events.InteractionCreate, async interaction => {
  if(!interaction.isChatInputCommand()) return;
  console.log(interaction);

  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

  try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		if (interaction.replied || interaction.deferred) {
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

client.login(process.env.LOGIN_TOKEN);