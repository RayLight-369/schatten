const { createUser, writeDB, db, addLog } = require("../utils.js");
var datas = db.getData();

String.prototype.isNumber = function() { return /^\d+$/.test(this); };


///////////////////////////////////////////////////////////////////////////////////////////////////////////



module.exports = {

  name: 'gamble',
  aliases: ['gb', 'gamble'],
  description: 'gamble',
  minArgs: 1,
  usage: '<amount> <h|t>',
  exec: (client, msg, args) => {

    let amount = args[0];
    let opt = args[1] || "h";
    let percent = Math.floor(Math.random() * 100);
    let heads_or_tails = percent < 31 ? "h" : percent < 61 ? "t" : "n";

    if ((opt == "h" || opt == "t")) {

      if (!db.exists(msg.author.id)) {

        createUser(msg.author.id, client);

      } else {

        if (heads_or_tails == opt) {

          if (amount > 0) {

            if (amount <= db.getData(msg.author.id).cash) {

              if (amount <= 150000) {

                msg.channel.send(`<@${msg.author.id}>, U have won ${amount * 2} :dollar:`);
                writeDB(msg.author.id, amount, client);
                addLog(`${msg.author.tag}  ------------->  ( ${amount} )`)

              } else {

                msg.channel.send(`<@${msg.author.id}>, U have won ${150000 * 2} :dollar:`);
                writeDB(msg.author.id, 150000, client);

                addLog(`${msg.author.tag}  ------------->  ( ${150000} )`)
              }

            }

          }

        } else {

          if (amount > 0) {

            if (amount <= db.getData(msg.author.id).cash) {

              if (amount <= 150000) {

                msg.channel.send(`<@${msg.author.id}>, U have lost your :dollar:`);
                writeDB(msg.author.id, -amount, client);

                addLog(`${msg.author.tag}  ------------->  ( ${-amount} )`)
              } else {

                msg.channel.send(`<@${msg.author.id}>, U have lost your :dollar:`);
                writeDB(msg.author.id, -150000, client);
                addLog(`${msg.author.tag}  ------------->  ( ${-150000} )`)

              }

            }

          }

        }

      }

    }
  }

};
