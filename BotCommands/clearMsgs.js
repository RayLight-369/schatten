const fs = require("fs");
const { clearMsgs , db} = require("../utils.js");

module.exports = {

  name: 'clearMsgs',
  aliases: ['cm', 'clearMsgs', "clearmsgs"],
  description: 'clear ai chat.',
  minArgs: 0,
  usage: '',
  exec: (client, msg, args) => {
    if (!db.exists(msg.author.id)) {

      createUser(msg.author.id, client);

    }


    
    clearMsgs(msg.author.id);
    msg.channel.send("Cleared Ai Chat.")
    
  }
};