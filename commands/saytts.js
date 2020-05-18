module.exports = {
    name : 'saytts',
    aliasas : ['stts, tts, sayt'],
    description : 'Sends message to channel and enables TTS.',
    execute(message, args) {
        const sayMessage = args.join(' ');
        message.delete().catch(O_o => {});
        message.channel.send(sayMessage, {tts : true});
    }
}