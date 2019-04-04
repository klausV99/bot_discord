//constante de départ pour la connexion ainsi que les commandes
//
const  Discord = require('discord.js');
const bot =new  Discord.Client();
const Youtube = require('./commandes/youtube.js');
//
//debut des instructions par rapport au commande afin d'afficher des messages si on parle au bot
//
     if(Youtube.match(msg)) {
         Youtube.action(msg)
     }
bot.on ('guildMemberAdd', member =>{
    member.guild.channels.get('541939693315686401').send(':star:'+member.user +' est pret a eradiquer du goblin avec la guild :star:');
});
//
//login du bot grace au token
//
bot.login('NTQ2OTk1NzU3NzMxOTM4MzE1.D0wVhw.4GDdlcdENhfH5ObSdhp4F5uLnDY');
//
//fin de code du bot goblin_slayer
//créer par Lefèvre Maxymilien
//compte discord : klausV99
//le 06/02/19