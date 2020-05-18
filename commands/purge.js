module.exports = {
    name : 'purge',
    aliases : ['clean', 'delete', 'prune'],
    description : 'Deletes 2 to 100 messages from the current text channel.',
    async execute(message, args) {
        // get delete amount as an integer
        const amount = parseInt(args[0], 10) + 1;
        
        if (!amount || amount <= 1 || amount >= 100)
            return message.reply("Please provide a number between 2 and 100 for the number of messages to delete.");
        
        await message.channel.messages.fetch({limit: amount}).then(messages => {
            message.channel.bulkDelete(messages);
        }).catch(error => message.reply(`Couldn't delete messages because of: ${error}`));
    }
}