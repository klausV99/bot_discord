module.exports=class kick_ban{
    static match(msg){
        return msg.content.startsWith('&goblin');
    }
    static action(msg){
        let args = msg.content.split(' ');

    }

};