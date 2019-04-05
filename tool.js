
module.exports ={
    randint(upper){
        return Math.floor(Math.random() * (upper));
    },
    isInt(value){
        let x =parseFloat(value);
        return !isNaN(value) && (x|0) === x;
    },
    wrap(content){
        return '``'+ content + '``';
    },
    parseOptions(commandString){
        let matches;
        let shortRegex = / -(\w+)/g;
        let longRegex  = / --(\w+)/g;
        let shortOpts = [];
        let longOpts = [];
        while(matches = shortRegex.exe(commandString)){
            if(matches[1].indexOf('==') == -1 ){
                for(leti = 0; i<matches[1].length;i++){
                    shortOpts.push(matches[1][i]);
                }
            }
        }
        while(matches = longRegex.exec(commandString)){
            longOpts.push(matches[1]);
        }
        return {
            short: shortOpts,
            long : longOpts
        };
    },
    parseOptionArg(option, commandString){
        
    }
}