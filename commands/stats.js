module.exports = {
    name : 'stats',
    description : 'Sends a message with current amount of users, channels and servers.',
    execute(bot, msg) {
        msg.channel.send(`Serving ${bot.users.cache.size} users, in ${bot.channels.cache.size} channels of ${bot.guilds.cache.size} servers.`);
    }
}