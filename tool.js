
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
        let regex = new RegExp(`--${option} (.+)`);

        let matchArg = commandString.match(regex);
        if(matchArg) {
            return matchArg[1].slice(0,this.getNextArgIndex(matchArg[1])).trim().toLowerCase();
        }  
        else{
            return null;
        } 
    },
    getNextArgIndex(argString){
        let nextArgIndex = argString.indexOf('-');
        return nextArgIndex == -1 ? argString.length : nextArgIndex;
    },

    getUnixTime(){
        return Math.round((new Date()).getTime() /1000);
    }

}