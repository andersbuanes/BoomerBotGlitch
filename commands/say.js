module.exports = {
    name : 'say',
    description : 'Bot repeats message sent from user.',
    execute(message, args) {
        const sayMessage = args.join(" ");
        
        message.delete().catch(O_o=>{});

        message.channel.send(sayMessage);
    }
}