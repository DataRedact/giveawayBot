require('dotenv').config()

const {client, prefix, Discord} = require('./src/clientInit')

// commands
require('./src/commands/giveaways')

client.on('ready', () => {
    client.user.setActivity('g!start', {
        type: 'WATCHING'
    })
    console.log(`Bot connected as ${client.user.username}#${client.user.discriminator} with the id of ${client.user.id}`)
});



client.login(process.env.TOKEN)




