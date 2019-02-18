module.exports=class message{
    static match(msg){
        return msg.content.startsWith('&m');
    }

};