const fs = require("fs");
const { db, createUser, writeDB, addLog } = require("../utils.js");

const datas = db.getData();

String.prototype.isNumber = function() { return /^\d+$/.test(this); };

module.exports = {

  name: 'transfer',
  aliases: ['t', 'transfer'],
  description: 'transfer money',
  minArgs: 2,
  usage: ' <amount>',
  exec: (client, msg, args) => {

    let user = msg.mentions.members.first().user;
    let amount = parseInt(args[1]);

    if (args[0] == `<@${user.id}>`) {

      if (!db.exists(msg.author.id)) {

        createUser(msg.author.id, client);

      }

      if (!db.exists(user.id)) {

        createUser(user.id, client);

      }

      if (amount <= db.getData(msg.author.id).cash && amount > 0) {

        writeDB(msg.author.id, -amount, client);
        writeDB(user.id, amount, client);

        addLog(`${msg.author.tag} ======> ${amount} ======> ${user.tag}`)

        msg.channel.send(`${msg.author} sent ${amount} :dollar: to <@${user.id}>`);


      }

    }

  }

};