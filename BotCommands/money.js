const fs = require("fs");
const { db, createUser, writeDB, addLog } = require("../utils.js");

const datas = db.getData();

String.prototype.isNumber = function() { return /^\d+$/.test(this); };

module.exports = {

  name: 'money',
  aliases: ['m', 'money'],
  description: 'check ur money',
  minArgs: 0,
  usage: '',
  exec: (client, msg, args) => {
    let user = args.length == 1 ? msg.mentions.members.first().user : undefined;

    if (!db.exists(msg.author.id)) {

      createUser(msg.author.id, client);

    }




    if (user && args[0] == `<@${user.id}>` && msg.author.id == "588310788872077325") {
      msg.channel.send(`${user.username} have ${db.getData(user.id).cash} :dollar:`);
      addLog(`${msg.author.tag}  =============>  ( checked ${user.username}'s money )`);
    } else {

      msg.channel.send(`You have ${db.getData(msg.author.id).cash} :dollar:`);
      addLog(`${msg.author.tag}  =============>  ( checked money )`);

    }

  }

};