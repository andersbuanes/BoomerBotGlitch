module.exports = {
    name: 'kick',
    aliases: ['yoink', 'punt', 'boot'],
    category: 'admin',
    description: 'Kicks tagged member from server if sender of message has privileges.',
    async execute(message, args) {
        if (!message.member.roles.some(r => ['Administrator', 'Moderator'].includes(r.name)))
            return message.reply("Sorry, you don't have permissions to use this!");

        let member = message.mention.members.first() || message.guild.members.get(args[0]);
        if (!member)
            return message.reply("Please mention a valid member of this server.");
        if (!member.kickable)
            return message.reply("This user cannot be kicked! They might have a higher role than you.");

        // slice(1) removes the first part, which here should the the user mention or ID
        // join(' ') takes all the various parts to make it a single string
        let reason = args.slice(1).join(' ');
        if (!reason) reason = "No reason provided";

        await member.kick(reason)
            .catch(err => message.reply(`Sorry ${message.author} I couldn't kick because of : ${err}`));
        message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
    }
}