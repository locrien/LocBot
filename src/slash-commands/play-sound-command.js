const { SlashCommandBuilder } = require('discord.js');
const ytdl = require('ytdl-core');
const StreamType = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource, VoiceConnectionStatus } = require('@discordjs/voice');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('play-url')
        .setDescription('Play sound at URL in current VC'),
    async execute(interaction) {
        if (!interaction.member.voice) {
            interaction.reply('You must be in a voice channel to use this command.');
            return;
          }
    
          //soundplayer.playSoundM(interaction.member.voice, "testsound.mp3");
          //await interaction.reply('test');

          playAudioFromYouTube('https://www.youtube.com/watch?v=dQw4w9WgXcQ',interaction.member.voice )
    },
}

async function playAudioFromYouTube(link, voice) {

  try
  {
    // Get the audio stream from the YouTube video
    const ffPath = 'C:\\ffmpeg\\bin\\ffmpeg.exe';
    const stream = ytdl(link, { filter: 'audioonly', ffmpegPath: ffPath });

    const voiceChannel = voice.channel;
    const voiceChannelId = voice.channelId;

    console.log(`${voiceChannel.name}, id ${voiceChannelId}`);

    // Join the voice channel
    const connection = joinVoiceChannel({
      channelId: voiceChannel.id,
      guildId: voiceChannel.guild.id,
      adapterCreator: voiceChannel.guild.voiceAdapterCreator,
    });

    // Create an audio player and play the audio stream in the voice channel
    const player = createAudioPlayer();

    const info = await ytdl.getInfo(link);
    //const resource = createAudioResource(stream);
    const resource = createAudioResource(stream, { inputType: StreamType.Opus, inlineVolume: true, metadata: info.videoDetails, inputArgs: ['-reconnect', '1', '-reconnect_streamed', '1', '-reconnect_delay_max', '5'], bufferHint: 5000 });

    player.play(resource);

    player.on('error', error => {
      console.error('Error occurred while playing audio:', error);
    });

    player.on('debug', message => {
      console.log('Debug message:', message);
    });

    connection.subscribe(player);

    console.log("playing");
    // Wait for the audio to finish playing and then destroy the connection
    await new Promise(resolve => {
      player.on('stateChange', (oldState, newState) => {
        console.log(`Player state changed from ${oldState.status} to ${newState.status}`);
        
        if (
          oldState.status === VoiceConnectionStatus.Ready &&
          newState.status === VoiceConnectionStatus.Connecting
      ) {
          connection.configureNetworking();
      }

        if (newState.status === 'idle') {
          connection.destroy();
          resolve();
        }

        if (newState.status === 'autopaused') {
          console.log("1");
          connection.configureNetworking();
          console.log("2");
          player.play(resource);
          console.log("3");
        }
      });
    });
    console.log("done");
  } catch (err) {
    console.error('Error playing audio', err);
  }
    

    //await new Promise(resolve => setTimeout(resolve, 5000));

    //connection.destroy();
  }