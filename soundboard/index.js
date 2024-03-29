//Import Discord/YTDL && configs

const Discord = require('discord.js');
const {
	prefix,
	token,
	channel
} = require('./config.json');
const ytdl = require('ytdl-core');

//Connecting to the Matrix
const nugget = new Discord.Client();
console.log(token);
nugget.login(token).catch(err => console.log(err));
const queue = new Map();

//Console logging
nugget.once('ready', () => {
 console.log('Ready!');
});
nugget.once('reconnecting', () => {
 console.log('Reconnecting!');
});
nugget.once('disconnect', () => {
 console.log('Disconnect!');
});

var http = require('http');

http.createServer(function (req, res) {
 console.log("We made it boys")
 res.writeHead(200, {'Content-Type': 'text/plain'});
 res.write(req.url);
 res.end();
}).listen(8080);


nugget.on('message', async message => {
 //We don't care if the message is from Nugget or 
 if (message.author.bot) return;
 if (!message.content.startsWith(prefix)) return;


 //This is temporary. Nugget will be controlled by Buttons
 const serverQueue = queue.get(message.guild.id);

 if (message.content.startsWith(`${prefix}play`)) {
  execute(message, serverQueue).catch(err => console.log(err));
  return;
 } else if (message.content.startsWith(`${prefix}skip`)) {
  skip(message, serverQueue);
  return;
 } else if (message.content.startsWith(`${prefix}stop`)) {
  stop(message, serverQueue);
  return;
 } else if (message.content.startsWith(`${prefix}bark`)) {
  bar();
  return;
 } else {
  message.channel.send('You need to enter a valid command!')
 }


//Oh hello execution
 async function execute(message, serverQueue) {
  const args = message.content.split(' ');
  const voiceChannel = message.member.voiceChannel;
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has('CONNECT') || !permissions.has('SPEAK')) {
   return message.channel.send('Oink Oink Oink Oink Oink Oink');
  }

 const songInfo = await ytdl.getInfo(args[1]);
 const song = {
  title: songInfo.title,
  url: songInfo.video_url,
 };
 if (!serverQueue) {
  // Creating the contract for our queue
  const queueContruct = {
   textChannel: message.channel,
   voiceChannel: voiceChannel,
   connection: null,
   songs: [],
   volume: 5,
   playing: true,
  };
  // Setting the queue using our contract
  queue.set(message.guild.id, queueContruct);

  // Pushing the song to our songs array
  queueContruct.songs.push(song);

  try {
   // Here we try to join the voicechat and save our connection into our object.
    var connection = await voiceChannel.join();
    queueContruct.connection = connection;
    // Calling the play function to start a song
    play(message.guild, queueContruct.songs[0]);
   } catch (err) {
    // Printing the error message if the bot fails to join the voicechat
    console.log(err);
    queue.delete(message.guild.id);
    return message.channel.send(err);
   }
  }else {
   serverQueue.songs.push(song);
   console.log(serverQueue.songs);
   return message.channel.send(`${song.title} oink oink added oink oink queue!`);
  }
 }

 function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
   serverQueue.voiceChannel.leave();
   queue.delete(guild.id);
   return;
  }
  const dispatcher = serverQueue.connection.playStream(ytdl(song.url))
  .on('end', () => {
   console.log('Music ended!');
   // Deletes the finished song from the queue
   serverQueue.songs.shift();
   // Calls the play function again with the next song
   play(guild, serverQueue.songs[0]);
  })
  .on('error', error => {
   console.error(error);
  });
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
 }

 function skip(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  if (!serverQueue) return message.channel.send('There is no song that I could skip!');
  serverQueue.connection.dispatcher.end();
 }

 function stop(message, serverQueue) {
  if (!message.member.voiceChannel) return message.channel.send('You have to be in a voice channel to stop the music!');
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
 }

 function bar(message){
  nugget.channels.get(channel).send("Holy shit Oink Oink")
 }

 function yoink(){
  nugget.member.get()
 }

});

