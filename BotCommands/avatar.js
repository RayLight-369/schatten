const fs = require("fs");
const { addLog, Discord } = require("../utils.js");
// const { db } = require( "D:\\Ray Files\\SchattenBot\\db.js" );

// const datas = fs.readFileSync( "D:\\Ray Files\\SchattenBot\\db.js" ).toString().split( "\n" );
String.prototype.isNumber = function() { return /^\d+$/.test(this); };

module.exports = {

  name: 'avatar',
  aliases: ['a', 'avatar'],
  description: 'check ur avatar',
  minArgs: 0,
  usage: '<@user>',
  exec: (client, msg, args) => {


    if (args[0]) {

      if (args[0].startsWith("<@") && args[0].endsWith(">")) {
        let id = args[0].slice(2, args[0].length - 1);

        client.users.fetch(id).then(user => {

          let embed = new Discord.MessageEmbed()
            .setAuthor(user.username)
            .setColor(msg.mentions.members.size ? msg.mentions.members.first().displayHexColor : msg.member.displayHexColor)
            .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
            .setTimestamp();

          msg.channel.send(embed);
          addLog(`${msg.author.tag}  -------------> 
 (checked ${user.tag} avatar))`)


        }).catch(console.error);
      } else if (typeof args[0] == "string" && args[0].isNumber()) {

        if (client.guilds.fetch(args[0])) {

          client.guilds.fetch(args[0]).then(guild => {

            let embed = new Discord.MessageEmbed()
              .setAuthor(guild.name)
              .setColor("#ffff00")
              .setImage(guild.iconURL({ size: 2048, dynamic: true }))
              .setTimestamp();

            msg.channel.send(embed);
            addLog(`${msg.author.tag}  ------------->  (checked ${args[0]} (guild) avatar))`)

          });

        }

      }


    } else {

      let user = msg.author;

      let embed = new Discord.MessageEmbed()
        .setAuthor(user.username)
        .setColor(msg.mentions.members.size ? msg.mentions.members.first().displayHexColor : msg.member.displayHexColor)
        .setImage(user.displayAvatarURL({ size: 2048, dynamic: true }))
        .setTimestamp();

      msg.channel.send(embed);
      addLog(`${msg.author.tag}  ------------->  (checked avatar))`)

    }


  }
};