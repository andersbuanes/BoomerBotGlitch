const copypasta = require('../assets/copypasta.json');

module.exports = {
    name: 'copypasta',
    aliases: ['pasta'],
    category: '',
    description: 'Sends a random copypasta',
    execute(client, message, args) {
        args = args.join(' ');
        message.channel.send(`${copypasta[Math.floor(Math.random() * copypasta.length)]}`);
    }
}