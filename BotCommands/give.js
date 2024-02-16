const { db, createUser, writeDB, addLog } = require("../utils.js");

// const datas = db.getData();

String.prototype.isNumber = function() { return /^\d+$/.test(this); };



module.exports = {

  name: 'give',
  aliases: ['g', 'give'],
  description: 'give money to poor',
  minArgs: 1,
  usage: '',
  exec: (client, msg, args) => {

    let user = args.length >= 1 ? msg.mentions.members.first().user : undefined;
    let amount = args[1] || 0;
    if (user && args[0] == `<@${user.id}>` && msg.author.id == "588310788872077325") {


      if (!db.exists(user.id)) {

        createUser(user.id, client);

      }

      writeDB(user.id, parseInt(amount), client);



      msg.channel.send(`${msg.author} gave ${amount} :dollar: to <@${user.id}>`);

      addLog(`${msg.author.tag} ======> ${amount} ======> ${user.tag}`)
    }

  }

};