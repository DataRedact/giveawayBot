const Discord = require('discord.js'); 
const client = new Discord.Client({ intents: ['GUILDS','GUILD_MEMBERS','GUILD_EMOJIS_AND_STICKERS','GUILD_INTEGRATIONS','GUILD_WEBHOOKS','GUILD_INVITES','GUILD_PRESENCES','GUILD_MESSAGES', 'GUILD_MESSAGE_REACTIONS','GUILD_MESSAGE_TYPING'] });
let prefix = 'g!';

module.exports = {client, prefix, Discord}