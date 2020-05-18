const ytdl = require('ytdl-core');

module.exports = {
    name : 'lofi',
    description : 'Joins voice channel and plays ChilledCow LoFi-stream on YT.',
    execute(message) {
        // returns if message is sent by another bot

        const link = "https://www.youtube.com/watch?v=_H3Xju3vdcA&list=PLOzDu-MXXLliO9fBNZOQTBDddoA3FzZUo";
        const stream = ytdl(link, {filter: 'audioonly'}, {liveBuffer: '20000'}, {volume: '0.2'});
        var voiceChannel = message.member.voice.channel;
        voiceChannel.join().then(connection => {
            const dispatcher = connection.play(stream);
            dispatcher.on("end", end => voiceChannel.disconnect());
        }).catch(err => console.log(err));
    }
}