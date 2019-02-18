const Ytb = require('ytdl-core');
module.exports=class youtube{
    static match(msg){
        return msg.content.startsWith('&play');
    }
    static action(msg){
       var voiceChannel= msg.guild.channels
                        .filter(function (channel) {return channel.type === 'voice';})
                        .first();
        let args = msg.content.split(' ');

        voiceChannel.join().then(function (connection) {
                 let stream =Ytb(args[1]);
                 stream.on('error',function(){
                     msg.reply("je ne trouve pas la vidéo :cry: ");
                     connection.disconnect();});
                 connection.playStream(stream).on('end',function(){connection.disconnect();});

        })
    }
};