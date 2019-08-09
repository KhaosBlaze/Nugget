//Import Discord/YTDL && configs

const Discord = require('discord.js');
const {
	prefix,
	token,
} = require('./config.json');
const ytdl = require('ytdl-core');

//Connecting to the Matrix
const client = new Discord.Client();
console.log(token);
client.login(token).catch(err => console.log("Connection Abandoned"));

//Console logging
client.once('ready', () => {
 console.log('Ready!');
});
client.once('reconnecting', () => {
 console.log('Reconnecting!');
});
client.once('disconnect', () => {
 console.log('Disconnect!');
});