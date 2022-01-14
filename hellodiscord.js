/**
 * "StAuth10222: I James Gelfand, 000275852 certify that this material is my original work. 
 * No other person's work has been used without due acknowledgement. 
 * I have not made my work available to anyone else."
 */

// Basic example of a Discord bot
// When running for the first time, use NPM Install in CMD to install the needed packages.
// Then run node hellodiscord.js

const { Client, Intents } = require('discord.js')
const client = new Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

// the 'ready' event will occur when the bot has loggged in
client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`)
});

// the 'messageCreate' event will occur when a message is entered into a channel
client.on('messageCreate', async message => {

  // The callback function to respond to this event will recieve a 'message' 
  // argument that is an object with many keys describing the message (who 
  // sent it, the message content, the channel, what is it a bot that sent 
  // it, etc.).  Check out this data in the console.
  console.log(message);
  
  // We send a message back in reply with message.reply( ... ) which excepts a 
  // string as an argument.  In this case, we send back the same message content
  // that was received (i.e. our bot will reply with the same message).  We only
  // have the bot reply if the author of the message was not itself a bot, 
  // otherwise we can have an infinite loop of messages as our bot would 
  // continually reply to its own messages!
  if (!message.author.bot) 
    await message.reply(message.content);
})

// logs in the bot to the channel
client.login("ODk3NTg0MjU4Mzc2NDIxNDA3.YWXyew.VuKp2a9_a27jp6hre-KUEVr3IaE");