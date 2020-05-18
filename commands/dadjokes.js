const dadjoke = require('../assets/dadjokes.json');

module.exports = {
    name: 'dadjokes',
    aliases: ['dad', 'jerry', 'dadjoke'],
    category: '',
    description: 'Sends a horrible dad joke.',
    execute(message) {
        message.channel.send(`${dadjoke[Math.floor(Math.random() * dadjoke.length)]}`);
    }
}