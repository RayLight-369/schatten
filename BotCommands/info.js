const fs = require("fs");
const { db, createUser, writeDB, addLog, Discord } = require("../utils.js");

const datas = db.getData();


module.exports = {

  name: 'info',
  aliases: ['i', 'info'],
  description: 'check ur time',
  minArgs: 0,
  usage: '<@user>',
  exec: (client, msg, args) => {

    let user = msg.mentions.members.size ? msg.mentions.members.first().user : msg.author;
    let embed = new Discord.MessageEmbed()
      .setTitle(`Info`)
      .setAuthor(user.username)
      .setColor(msg.mentions.members.size ? msg.mentions.members.first().displayHexColor : msg.member.displayHexColor)
      .addFields(
        { name: 'Account created on :', value: user.createdAt }
      )
      .setThumbnail(user.displayAvatarURL())
      .setImage(user.displayAvatarURL())
      .setTimestamp();

    let roles = "";
    // let ROLES = 
    msg.mentions.members.size ? msg.mentions.members.first().roles.cache.filter(r => r.id) : msg.member.roles.cache.filter(role => role.id).forEach(id => {

      roles += `${id}`;

    });

    // ROLES.forEach(id => {

    //   roles += `${id}`;

    // });

    embed.addField("ROLES : ", roles)
      .addField('\u200B', '\u200B')
      .addField("Avatar Url : ", user.displayAvatarURL())
      .addField("ID : ", user.id);

    msg.channel.send({ embed });
    addLog(`${msg.author.tag}  ------------->  info of ${user.tag}`)

  }
};