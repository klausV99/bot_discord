module.exports = class google{

    static match(msg){
        return msg.content.startsWith('&g');
    }

    static action (msg){
       let args= msg.content.split(' ');
        args.shift();
        msg.reply('https://www.google.com/#q='+args.join('%20'));
    }

};