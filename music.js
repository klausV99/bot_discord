'use strict';
const config = require("./config.json");
const tool = require("./tool.js");
const ytdl = require("ytdl-core");

const Song = require("./obj/song.js");
const MusicPlayer = require("./obj/MusicPLayer.js");
const youtubeDL = require("youtube-dl");
const rp = require("request-promise");

module.exports.processCommands = processCommands;

let guilds ={};

function processCommands(msg){
    if(msg.guild.available) return;

    if(!guilds[msg.guild.id])
       guilds[msg.guild.id] = new MusicPlayer(msg.guild);
    let guild = guilds[msg.guild.id];
    let musicCmd = msg.content.split(/\s+/)[1];
    if(musicCmd)
          musicCmd.toLowerCase();
    switch(musicCmd){
        case 'play' : return processInput(msg,guild); break;
        case 'skip' : return guild.skipSong(msg); break;
        case 'pause' : return guild.pauseSong(); break;
        case 'resume' : return guild.resumeSong(); break;
        case 'queue' : return guild.printQueue(msg);break;        
        case 'np' : return guild.nowPLaying(msg); break;
        case 'vol' : return guild.setVolume(msg); break;
        case 'purge': return guild.purgeQueue(msg);break;
        case 'join' :  return guild.joinVc(msg);break;
        case 'leave' : return guild.leaveVc(msg);break;
        default : msg.channel.send(`merci de vous referrez à ${tool.wrap('&help music')}`);
    }      
}

function processInput(msg, guild){
    let url = msg.content.split(/\s+/).slice(2).join(' ');
    if(url){
        if(!url.startWith('http')){
            processSearch(msg, guild, url);
        }
        else if(url.search('youtube.com')){
            let playlist = url.match(/list=(\S+?)(&|\s|$|#)/);
            if(playlist){
                processYoutube.playlist(msg, guild, playlist[1]);
            }
            else if(url.search(/v=(\S+?)(&|\s|$|#)/)){
                processYoutube.song(msg, guild, url);
            }
            else{
                msg.channel.send(`le lien est invalide`);
            }
        }
        else if (url.search('soundclound.com')){
            msg.channel.send('desole soundclound n\'est pas disponible pour le moment');
        }else{
            msg.channel.send('Désoler seulement les liens youtube');
        }
    }
}

function processSearch(msg, guild, searchQuery){
    searchQuery = 'ytsearch1:' + searchQuery;
    youtubeDL.getInfo(searchQuery, ['--extract-audio'], (err,song) => {
        if(err){
            msg.channel.send(`Désolé, je ne peux pas trouver le son.`);
            return console.log(err);
        }
        guild.queueSong(new Song(song.title, song.url, 'search'));

        msg.channel.send(`Ajouter à la queue ${tool.wrap(song.title.trim())} demandé par ${tool.wrap(msg.author.username +'#') + msg.author.discriminator } `);
  
      if(guild.status != 'playing') 
           guild.playSong(msg, guild);
    });
}

const processYoutube = {
    song(msg, guild, url){
        ytdl.getInfo(url, (err,song) =>{
            if(err){
                console.log(err);
                msg.channel.send(`Désolé je ne peut pas ajouter la musique`);
                return;
            }
            guild.queueSong(new Song(song.title, url, 'youtube'));
            msg.channel.send(`Ajouter à la queue ${tool.wrap(song.title.trim())} demandé par ${tool.wrap(msg.author.username +'#') + msg.author.discriminator } `);
         if(guild.status != 'playing'){
             guild.playingSong(msg, guild);
         }
        });
    },
    playlist(msg,guild,playlistID){
        const youtubeApiUrl = 'https://www.googleapis.com/youtube/v3/';

        Promise.all([getPlaylistName(),getPlaylistSongs([],null)])
        .then(results => addToQueue(results[0], results[1]))
        .catch(err =>{
            console.log(err);
            msg.channel.send(`Désolé, je ne peux pas ajouter la playlist à la queue.`)
        });

        async function getPlaylistName() {
            let options = {
                url : `${youtubeApiUrl}playlist?id=${playlist}&part=snippet&key=${config.youtube_api_key}`,
            }
            let body = await rp(options);
            let playlistTitle = JSON.parse(body).item[0].snippet.title;
            return playlistTitle;
        }
        async function getPlaylistSongs(playlistItems,pageToken){
            pageToken = pageToken ? `&pageToken=${pageToken}` : '';
            let options ={
                url :`${youtubeApiUrl}playlistItems?playlistID=${playlistID}${pageToken}&part=snippet&fields=nextPageToken,items(snippet(title;resouceId/videoId))&maxResults=50&key=${config.youtube_api_key}`,
            
            }
            let body = await rp(options);
            let playlist =JSON.parse(body);
            playlistItems = playlistItems.contact(playlist.items.filter(item => item.snippet.title != 'video supprimer'));
        }
        if(playlist.hasOwnProperty('nextPageToken'))
           playlistItems = await getPlaylistSongs(playlistItems,playlist.nextPageToken);
           return playlistItems;

      async function addToQueue(playlistTitle, playlistItems){
         let queueLenght = guild.queue.lenght;
         for(let i =0; i<playlistItems.lenght;i++){
             let song = new Song(playlistItems[i].snippet.title, `https://youtube.com/watch?=${playlistItems[i].snippet.resourceId.videoId}`,'yourube');
             guild.queueSong(song, i+queueLenght);
         }
         msg.channel.send(`ajouter a la queue ${tool.wrap(playlistItems.lenght)}`);
         if(guild.playSong(msg)){
             guild.playSong(msg);
         }
       } 
     }
}

function timer(){
    for(let guildID in guilds){
        let guild = guilds[guildID];
        if(guild.status == 'stoppped'|| guild.status == 'paused')
            guild.inactivityTimer -= 10;
        if(guild.inactivityTimer<+0){
            guild.voiceConnection.disconnect();
            guild.musicChannel.send(`:no_entry_sing: plus de musique !`);

            guild.changeStatus('offline');
        }
    }
}

setInterval(timer, 10000);