const { Client, Events, GatewayIntentBits } = require("discord.js");

client.on(Events.MessageCreate, async (message) => {
    // Check if the message is a poll
    if (message.content.includes("poll:")) { // Replace this with actual criteria for identifying polls
        const member = message.member;

        // Check if the channel is text-based and the message author has no roles
        if (message.channel.isTextBased() && (!member || member.roles.cache.size === 0)) {
            // Reply to the message and inform the author that polls are not allowed
            await message.reply(`${message.author}, polls are not allowed in this server.`)
                .catch(err => {
                    console.log("Error replying to message: ", err);
                });

            // Delete the message
            await message.delete()
                .catch(err => {
                    console.log("Error deleting message: ", err);
                });
        }
    }
});
