const https = require('https');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
  playAudio
};

let connection;

async function joinChannel(voice) {
  const voiceChannel = voice.channel;
  const voiceChannelId = voice.channelId;

  console.log(`${voiceChannel.name}, id ${voiceChannelId}`);

  connection = joinVoiceChannel({
    channelId: voiceChannelId,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
}

async function exitChannel() {
  if (connection) {
    connection.destroy();
    connection = null; // Reset the connection variable to null
  }
}

async function playAudio(voice, filename) {

    const soundFileUrl = 'https://www.computerhope.com/jargon/m/example.mp3'

    //const voiceChannel = await client.channels.fetch(voiceChannelId);

    // Make an HTTP request to the sound file URL and create a Readable stream from the response
    const request = https.get(soundFileUrl, response => {
        const resource = createAudioResource(response);
    
        // Create the audio player and play the audio resource
        const player = createAudioPlayer();
        player.play(resource);
        connection.subscribe(player);
    
        // When the audio has finished playing, disconnect from the voice channel
        player.on('stateChange', (oldState, newState) => {
        if (newState.status === 'idle') {
            connection.destroy();
        }
        });
    });
  
    // Handle errors with the HTTP request
    request.on('error', error => {
        console.error(`Error requesting sound file: ${error.message}`);
    });
  
    // Set a timeout for the HTTP request
    request.setTimeout(5000, () => {
        request.destroy();
        console.error(`Timeout requesting sound file: ${soundFileUrl}`);
    });
}

/*

// Get the voice channel object


// Join the voice channel
const connection = joinVoiceChannel({
  channelId: voiceChannelId,
  guildId: voiceChannel.guild.id,
  adapterCreator: voiceChannel.guild.voiceAdapterCreator,
});

// Make an HTTP request to the sound file URL and create a Readable stream from the response
const request = https.get(soundFileUrl, response => {
  const resource = createAudioResource(response);

  // Create the audio player and play the audio resource
  const player = createAudioPlayer();
  player.play(resource);
  connection.subscribe(player);

  // When the audio has finished playing, disconnect from the voice channel
  player.on('stateChange', (oldState, newState) => {
    if (newState.status === 'idle') {
      connection.destroy();
    }
  });
});

// Handle errors with the HTTP request
request.on('error', error => {
  console.error(`Error requesting sound file: ${error.message}`);
});

// Set a timeout for the HTTP request
request.setTimeout(5000, () => {
  request.abort();
  console.error(`Timeout requesting sound file: ${soundFileUrl}`);
});
*/

/*
const ytdl = require('ytdl-core');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

async function playAudioFromYouTube(link, voiceChannel) {
  // Get the audio stream from the YouTube video
  const stream = ytdl(link, { filter: 'audioonly' });

  // Join the voice channel
  const connection = joinVoiceChannel({
    channelId: voiceChannel.id,
    guildId: voiceChannel.guild.id,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });

  // Create an audio player and play the audio stream in the voice channel
  const player = createAudioPlayer();
  const resource = createAudioResource(stream);
  player.play(resource);
  connection.subscribe(player);

  // Wait for the audio to finish playing and then destroy the connection
  await new Promise(resolve => {
    player.on('stateChange', (oldState, newState) => {
      if (newState.status === 'idle') {
        connection.destroy();
        resolve();
      }
    });
  });
}
*/