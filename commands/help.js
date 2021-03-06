const {RichEmbed} = require('discord.js');
const {StripIndents} = require('common-tags');

module.exports = {
    name : 'help',
    aliases : ['h'],
    category : 'info',
    description: 'Returns all commands, or one specific command info',
    usage: '[command | alias]',
    run: async (client, message, args) => {
        if (args[0]) {

        } else {

        }
    }
}

function getAll(client, message) {
    const embed = new RichEmbed().setColor("RANDOM");
    
    const commands = (category) => {
        return client.commands
            .filter(cmd => cmd.category === category)
            .map(cmd => `- \`${cmd.name}`)
            .join("\n");
    }

    const info = client.categories
        .map(cat => StripIndents`**${cat[0].toUpperCase() + cat.slice(1) + `\n${commands(cat)}`}`)
        .reduce((string, category) => string + "\n" + category);

    return message.channel.send(embed.setDescription(info));
}

function getCmd(client, message, input) {
    const embed = new RichEmbed();

    const cmd = client.commands.get(input.toLowerCase()) || client.commands.get(client.aliases.get(input.toLowerCase()));

    let info = `No information found for command **${input.toLowerCase()}**`;

    if (!cmd) {
        return message.channel.send(embed.setColor("RED").setDescription(info));
    }

    if (cmd.name) info = `Command name: ${cmd.name}`;
    if (cmd.aliases) info += `\nAliases: ${cmd.aliases.map(a => `\`${a}\``).join(", ")}`;
    if (cmd.description) info += `\nDescription: ${cmd.description}`;
    if (cmd.usage) { 
        info += `\nUsage: ${cmd.usage}`;
        embed.setFooter(`Syntax: <> = required, [] = optional`);
    }

    return message.channel.send(embed.setColor("GREEN").setDescription(info));
}