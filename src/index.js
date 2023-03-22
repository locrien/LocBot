const { Client, GatewayIntentBits } = require('discord.js');
var soundplayer = require('./soundplayer');
require('dotenv').config();

const client = new Client({ intents: [GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.Guilds,
    GatewayIntentBits.MessageContent,] });

const commands = [
  {
    commandPrefix: '!hello',
    description: 'Say hello',
    async execute(message, args) {
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

  for (const command of commands) {
    if (message.content.startsWith(command.commandPrefix)) {
      const commandBody = message.content.slice(command.commandPrefix.length);
      const args = commandBody.trim().split(/ +/g);
      await command.execute(message, args);
      break;
    }
  } 
});

client.login(process.env.DISCORD_LOGIN_TOKEN);