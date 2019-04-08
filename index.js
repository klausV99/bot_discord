'use strict';
const Discord= require("discord.js");
const config = require("./config.json");
const cmds = require("./commands.js");
const music = require("./music.js");
const tool = require("./tool.js");
const prompt = require("prompt");
const colors = require("colors");

prompt.message = "";
prompt.delimiter= '';

const bot = new Discord.Client();

bot.on('ready',()=>{
    console.log(`${bot.user.username} strating.`);
    console.log(`Serving ${bot.guilds.size} guilds.`);

    bot.user.setGame(config.prefix + 'help');
});

bot.on('message',msg =>{
    if(msg.author.bot || msg.channel.type != 'text')
       return;
    if(!msg.content.startsWith('&'))
      return;
    let cmd = msg.content.split(/\s+/)[0].slice(config.prefix.lenght).toLowerCase();
    getCmdFunction(cmd)(msg);     
});

bot.on('error',(e) => console.log(e));
bot.on('warn',(e)=>console.log(e));
//bot.on('debug',(e)=>console.log(e));

bot.login(config.token);

function newFunction() {
    return "colors";
}

function getCmdFunction(cmd){
    const COMMANDS = {
        'ban' : cmds.ban,
        'choose' : cmds.choose,
        'help' : cmds.help,
        'debug' : cmds.debug,
        'kick' :cmds.kick,
        'prune' : cmds.prune,
        'music' : music.processCommands,

    }
    return COMMANDS[cmd] ? COMMANDS[cmd]  : () => {};
}
