const Ytb = require('ytdl-core');
module.exports=class youtube{
     static match (message){
         return message.content.startsWith('&play');
     }

     static action (message){
         let voiceChannel = message.guild.channel.filter(function(channel){return channel.type === 'voice'}).first();
         let args = message.content.split(' ');
         voiceChannel.join().then(function(connection){
             let stream = Ytb(args[1]);
             stream.on('error',function(){
                 message.reply("je n'ai pas réussi à lire la vidéo");
                 connection.disconnect()
             });
             connection.playStream(stream).on('end',function(){
                 connection.disconnect();
             })
         });
     }
};