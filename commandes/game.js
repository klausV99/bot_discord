module.exports=class game{
    static match(msg){
        return msg.content.startsWith('&s');
    }
    static action(msg){
        let args = msg.content.split(' ');

    }

};