const commando = require('discord.js-commando');
const oneLine = require('common-tags').oneLine;

var name = "1337";
module.exports = class L33TCommand extends commando.Command {
    constructor(client) {
        super(client, {
            name: '1337',
            aliases: ['leet'],
            category: 'message_formatting',
            description: 'Translates a message to 1337.',
            details: oneLine`Translates a message to 1337`,
            examples: ["1337 Hello there, how are you?"],
            args: [
                    {
                        key: 'text',
                        promt: 'What text would you like to convert to 1337?',
                        type: 'string'
                    }
            ]
        });
    }

    async run(msg, { text }) {
        
    }
}