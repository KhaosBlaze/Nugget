//Import Discord/YTDL && configs

const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

//Connecting to the Matrix
const nugget = new Discord.Client();
console.log(token);
nugget.login(token).catch(err => console.log(err));

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

nugget.on('message', async message => {
  
});