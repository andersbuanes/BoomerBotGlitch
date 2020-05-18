// Load up the discord.js library
const fs = require("fs");
const Discord = require('discord.js')
// const config = require("./config.json");
const { token, prefix } = require('./config.json')
const client = new Discord.Client();

const log = message => {
	console.log(`[${moment.format('YYYY-MM-DD HH:mm:ss')}] ${message}`);
}

client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);

	// set a new item in the Collection
	// with the key as the command name and the value as the exported module
	client.commands.set(command.name, command);
}
/*
fs.readdirSync('./commands/', (err, files) => {
	if (err) console.error(err);
	log(`Loading a total of ${files.length} commands.`);
	files.forEach(f => {
		let props = require(`./commands/${f}`);
		log(`Command loaded! ${props.help.name}`);
		client.commands.set(props.help.name, props);
		props.conf.aliases.forEach(alias => {
			client.aliases.set(alias, props.help.name);
		});
	});
});
*/
// command reload
client.reload = command => {
	return new Promise((resolve, reject) => {
		try {
			delete require.cache[require.resolve(`./commands/${command}`)];
			let cmd = require(`./commands/${command}`);
			client.commands.delete(command);
			client.aliases.forEach((cmd, alias) => {
				if (cmd === command) client.aliases.delete(alias);
			});
			client.commands.set(command, cmd);
			cmd.conf.aliases.forEach(alias => {
				client.aliases.set(alias, cmd.help.name);
			});
		} catch (e) {
			reject(e);
		}
	});
};

// client permission level
client.elevation = message => {
	if (message.channel.type === 'dm') return;
	let permlvl = 0;
	if (message.member.hasPermission("MANAGE_MESSAGES")) permlvl = 1;
	if (message.member.hasPermission("BAN_MEMBERS")) permlvl = 2;
	if (message.member.hasPermission("MANAgE_GUILD")) permlvl = 3;
	if (message.member.id === message.guild.ownerID) permlvl = 4;
	
	return permlvl;
};

client.on("ready", () => {
	// This event will run if the bot starts, and logs in, successfully.
	console.log(`Bot has started, with ${client.users.cache.size} users, in ${client.channels.cache.size} channels of ${client.guilds.cache.size} servers.`);

	client.user.setActivity(`Battlerite`);
});

// Error handling
client
	.on("error", console.error)
	.on("warn", console.warn)
	.on("debug", console.log);

// Bot status
client
	.on("reconnecting", () => {
		console.warn("BoomerBot is reconnecting...");
	})
	.on("disconnect", () => {
		console.warn("Warning! BoomerBot has disconnected.");
	});


client.on("guildCreate", guild => {
	// This event triggers when the bot joins a guild.
	console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.on("guildDelete", guild => {
	// This event triggers when the bot is removed from a guild.
	console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
	client.user.setActivity(`Serving ${client.guilds.cache.size} servers`);
});

client.facts = require("./facts.json");

client.on("message", async message => {
	// This event will run on every single message received, from any channel or DM.

	if (message.content.indexOf(prefix) !== 0 || message.author.bot) return;

	//const args = msg.content.slice(config.prefix.length).trim().split(/ +/g);
	const args = message.content.slice(prefix.length).trim().split(/ +/g);
	const cmd = args.shift().toLowerCase();

	if (cmd === 'args-info') {
		if (!args.length) {
			return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
		}

		message.channel.send(`Command name: ${cmd}\nArguments: ${args}`);
	}

	if (cmd === 'lofi') {
		client.commands.get('lofi').execute(message);
	}

	if (cmd === 'stats') {
		client.commands.get('stats').execute(client, message);
	}

	if (cmd === "ping") {
		//m.edit(`Pong! Latency is ${m.createdTimestamp - msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ping)}ms`);
		client.commands.get('ping').execute(message);
	}

	if (cmd === "say") {
		const sayMessage = args.join(" ");
		const taggedUser = message.mentions.users.first();

		message.delete().catch(O_o => { });

		if (message.mentions.users.size) {
			message.channel.send(`${taggedUser.username}` + sayMessage);
		} else {
			message.reply('sa: ' + sayMessage);
		}
	}

	if (cmd === "copypasta" || cmd === "pasta") {
		client.commands.get('copypasta').execute(client, message, args);
	}

	if (cmd === "dadjoke" || cmd === "dad" || cmd === "jerry" || cmd === 'dadjokes') {
		client.commands.get('dadjokes').execute(message);
	}

	if (cmd === "facts") {
		/*
		let _facts = ["Only 3.6% of people over 65 years old are in nursing homes. Elderly men are likely to live with a spouse while elderly women are more likely to live alone.",
		"4 in 5 older adults will battle at least one chronic condition or illness such as heart disorders, arthritis, or osteoporosis. 50% will battle at least two.",
		"By age 75, about 1 in 3 men and 1 in 2 women don't get ANY physical activity.",
		"While fatal crash rates increase starting at age 75, older drivers' crash rates have fallen faster than the crash rates of middle-aged drivers. One of the reasons is that older drivers tend to limit their driving during bad weather and at night.",
		"The ratio of women to men over 65 years old is 100 to 76. The ratio of women to men over 85 years old is 100 to 49.",
		"People over 75 years old visit the doctor 3 times more often than people 22 to 44 years old.",
		"We are born with 350 bones in our skeleton. Over the course of time and during our aging process, our bones fuse together leaving us with 206 bones as adults.",
		"Due to advancements in health care and technology, people are living longer. By the year 2040 the population of seniors over 85 is expected to triple from 5.7 million to 14.1 million.",
		"Our sleeping patterns change as we age: we get tired earlier and wake up earlier."];
		var index = Math.floor(Math.random() * _facts.length);
		msg.channel.send(_facts[index]);
		*/
		client.commands.get('facts').execute(message);
	}

	if (cmd === "summon") {
		message.channel.send(`Sup ${message.member.user.tag}?`);
		message.member.voice.channel.join();
	}

	if (cmd === "begone") {
		message.channel.send(`Vil du ikke ha meg her, ${message.member.user.tag}?`);
		message.member.voice.channel.leave();
	}

	if (cmd === "narkotika") {
		var voiceChannel = message.member.voice.channel;
		voiceChannel.join().then(connection => {
			const dispatcher = connection.play('./audio/naarkotika.mp3', { value: 0.04 }, { volume: 0.5 });
			dispatcher.on("finish", end => voiceChannel.leave());
		}).catch(err => console.log(err));
	}

	if (cmd === "nuddel") {
		var voiceChannel = message.member.voice.channel;
		voiceChannel.join().then(connection => {
			const dispatcher = connection.play('./audio/skididdel_kort.mp3', { value: 0.04 }, { volume: 0.5 });
			dispatcher.on("finish", end => voiceChannel.leave());
		}).catch(err => console.log(err));
	}

	/*
	if(command === "kick") {
	  if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
		return message.reply("Sorry, you don't have permissions to use this!");
	  
	  let member = message.mentions.members.first() || message.guild.members.get(args[0]);
	  if(!member)
		return message.reply("Please mention a valid member of this server");
	  if(!member.kickable) 
		return message.reply("I cannot kick this user! Do they have a higher role? Do I have kick permissions?");
	  
	  // slice(1) removes the first part, which here should be the user mention or ID
	  // join(' ') takes all the various parts to make it a single string.
	  let reason = args.slice(1).join(' ');
	  if(!reason) reason = "No reason provided";
	  
	  await member.kick(reason)
		.catch(error => message.reply(`Sorry ${message.author} I couldn't kick because of : ${error}`));
	  message.reply(`${member.user.tag} has been kicked by ${message.author.tag} because: ${reason}`);
  
	}
	*/
	/*
	if(command === "ban") {
	  if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
		return message.reply("Sorry, you don't have permissions to use this!");
	  
	  let member = message.mentions.members.first();
	  if(!member)
		return message.reply("Please mention a valid member of this server");
	  if(!member.bannable) 
		return message.reply("I cannot ban this user! Do they have a higher role? Do I have ban permissions?");
  
	  let reason = args.slice(1).join(' ');
	  if(!reason) reason = "No reason provided";
	  
	  await member.ban(reason)
		.catch(error => message.reply(`Sorry ${message.author} I couldn't ban because of : ${error}`));
	  message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
	}
	*/
	if (cmd === "purge" || cmd === "delete" || cmd === "clean" || cmd === "prune") {
		// removes all messages from all users in the channel, up to 100.
		client.commands.get('purge').execute(message, args);
	}
});

client.login(token);