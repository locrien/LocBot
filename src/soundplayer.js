const https = require('https');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

module.exports = {
    async playSoundM(voice, filename) {
        await playSound(voice, filename);
    }
};

async function playSound(voice, filename) {

    const soundFileUrl = 'https://download.samplelib.com/mp3/sample-3s.mp3'//'https://example.com/' + filename; // Replace with the URL of your sound file

    //const voiceChannel = await client.channels.fetch(voiceChannelId);

    const voiceChannel = voice.channel;
    const voiceChannelId = voice.channelId;

    console.log(`${voiceChannel.name}, id ${voiceChannelId}`);

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