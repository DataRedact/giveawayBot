const {client, prefix, Discord} = require('../clientInit')
const ms = require('ms')

function isNumeric(str) { // bc isNaN becomes undefined after one use :p
    if (typeof str != "string") return false
    return !isNaN(str) && 
           !isNaN(parseFloat(str)) 
  }

let removeDuplicates = (array) => { // remove duplciate stuff in an array
    let set = new Set(array)
    let returnedArray = Array.from(set)
    return returnedArray
}

let emoji_id = '831469774302740540'
client.on('messageCreate', async (msg) => {
    if (msg.content.startsWith(prefix + 'start')) {
        await msg.channel.send({content: 'Alright! Lets config your giveaway (say end at any time to end the process)'});
        const filter = (m) => {
            return m.author.id == msg.author.id};
        await msg.channel.send({content: 'How long do you want your giveaway to be? (e.g 7 days is 7d, 1 month is 1m, 1 week is 1w, 7 amountoftime is 7d). Say "help" for all supported formats.'})
        const length = msg.channel.createMessageCollector(filter, { time: 15000 });

        length.on('collect', async m => {
            if (m.author.id != msg.author.id) {
                return
            }
            if (m.content == 'end') {
                length.stop()
                return msg.channel.send({content: 'Ended the giveaway process.'})
            }
            if (m.content.toLowerCase() == 'help') {
                return msg.channel.send({content: 'Seconds (s), minutes (mi), hours (h), days (d), week (w), month (m)'})
            }
            let splitContent = m.content.split('')
            let modifier = splitContent[splitContent.length - 1]
            splitContent.pop()
            let amountoftime = splitContent.join('')
            if (isNaN(amountoftime) == true) {
                return msg.channel.send({content: 'Please enter a number.'})
            } 
            if (modifier == undefined) {
                return msg.channel.send({content: 'Please enter a modifier, like day or month.'})
            }
            if (amountoftime == 0) {
                return msg.channel.send({content: 'Please enter a non-0 number'})
            }
            length.stop()
            msg.channel.send({content: 'What do you want to give away?'})
            const giveawayThing = msg.channel.createMessageCollector(filter, { time: 15000 });
            giveawayThing.on('collect', async m => {
                if (m.author.id != msg.author.id) {
                    return
                }
                if (m.content == 'end') {
                    giveawayThing.stop()
                    return msg.channel.send({content: 'Ended the giveaway process.'})
                }
                giveawayItem = m.content
                giveawayThing.stop()
                await msg.channel.send({content: 'How many winners do you want?'})
                const winnerAmount = msg.channel.createMessageCollector(filter, { time: 15000 });
                winnerAmount.on('collect', async m => {
                    if (m.author.id != msg.author.id) {
                        return
                    }
                    if (m.content == 'end') {
                        winnerAmount.stop()
                        return msg.channel.send({content: 'Ended the giveaway process.'})
                    }
                    let winnersAmount = 1 
                    if (isNumeric(m.content) == false) {
                        return msg.channel.send({content: 'Please enter a number.'})
                    }
                    if (m.content == 0) {
                        return msg.channel.send({content: 'You need at least one winner!'})
                    }
                    winnersAmount = m.content
                    const giveawayEmbed = new Discord.MessageEmbed()
                    .setColor('#0099ff ')
                    .setAuthor(`This giveaway is active!`, msg.author.avatarURL())
                    .setTitle(`${giveawayItem}`)
                    .setDescription('React with <a:giveaway:831469774302740540> to join!')
                    .addFields({
                        name:'Time', 
                        value: `${amountoftime}${modifier}`,
                        inline: true
                    }, {
                        name: 'Amount of winners', 
                        value: `${winnersAmount}`,
                        inline: true
                    })
                    .setTimestamp()
                    .setFooter(`${amountoftime}${modifier} Giveaway • ${winnersAmount} Winners • Sentencia Giveaways`, 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');

                    // const giveawayEmbed = new Discord.MessageEmbed()
                    // .setColor('#0099ff ')
                    // .setAuthor(`This giveaway is active!`, msg.author.avatarURL())
                    // .setTitle(`${giveawayItem}`)
                    // .setDescription('React with <a:giveaway:831469774302740540> to join!')
                    // .setTimestamp()
                    // .setFooter(`${amountoftime}${modifier} Giveaway • ${winnersAmount} Winners • Sentencia Giveaways`, 'https://cdn.discordapp.com/attachments/832714326258614326/834808899717955584/SENTENCIA.png');
                    let giveawayEmbedmsg = await msg.channel.send({embeds: [giveawayEmbed]})
                    giveawayEmbedmsg.react('<a:giveaway:831469774302740540>')
                    
                    let time = new Array;
                    time.push(amountoftime)
                    
                    modifier = modifier.toLowerCase()
                    if (modifier == 's') {
                        time.push('seconds')
                    } 
                    if (modifier == 'mi') {
                        time.push('minutes')
                    } 
                    if (modifier == 'h') {
                        time.push('hours')
                    } 
                    if (modifier == 'd') {
                        time.push('days')
                    } else if (modifier == 'w') {
                        time.push('weeks')
                    } else if (modifier == 'm') {
                        time.push('months')
                    } 
                    
                    
                    let timeinms = ms(time.join(' '))
                    const filter = (reaction, user) => {
                        return reaction.emoji.id == emoji_id;
                    };
                    let col = giveawayEmbedmsg.createReactionCollector({filter, time: timeinms})
                    let allReacted = new Array;
                    col.on('collect', (reaction, user) => {
                        if (reaction.emoji.id != emoji_id) {
                            return
                        }
                        allReacted.push(user.id)
                    })
                    winnerAmount.stop()
                    setTimeout(async () => {
                        // let allReacted = giveawayEmbedmsg.reactions.cache.map(m => m.users.id)
                        allReacted = removeDuplicates(allReacted)
                        let winner = Math.round(Math.random(0, allReacted.length))
                        let winnerID = allReacted[winner]
                        let fetchedUser = await msg.guild.members.fetch(winnerID)
                        msg.channel.send({content:` <@${winnerID}>`}).then(tag => tag.delete())
                        let newEmbed = new Discord.MessageEmbed()
                        .setTitle(giveawayEmbedmsg.embeds[0].title)
                        .setColor(giveawayEmbedmsg.embeds[0].hexColor)
                        .setAuthor(`This giveaway is over!`, msg.author.avatarURL())
                        .addFields({
                            name: 'Winners', value: `<@${winnerID}> (${fetchedUser.displayName})`
                        })
                        await giveawayEmbedmsg.edit({embeds: [newEmbed]})


                        
                    }, timeinms)
                })

            })

        });

    }
});