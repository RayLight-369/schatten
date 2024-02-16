const { db, createUser, Discord } = require("../utils.js");

// const datas = db.getData();

String.prototype.isNumber = function() { return /^\d+$/.test(this); };

module.exports = {

  name: 'img',
  aliases: ['imgs', 'image', 'images', 'design', 'designs'],
  description: 'save a design',
  minArgs: 0,
  usage: '',
  exec: async (client, msg, args) => {

    if (!db.exists(msg.author.id)) {

      createUser(msg.author.id, client);

    }
    if (msg.attachments.size > 0) {
      let data = db.getData(msg.author.id);
      data.imgs = "imgs" in data ? data.imgs : [];

      msg.attachments.forEach(img => {

        data.imgs.splice(0, 0, img.url);
        db.writeData(msg.author.id, data, true)
      })
    } else if (!args[0]) {
      // let embeds = [];
      let imgs = db.getData(msg.author.id).imgs ?? [];

      if (imgs.length) {
        for (let img of imgs) {
          msg.channel.send(img)
        }

      } else {
        msg.channel.send("<@" + msg.author + "> you dont have any images.")
      }
    }

    if (!isNaN(args[0])) {
      let img = db.getData(msg.author.id).imgs[parseInt(args[0] - 1)] ?? "nope , not with this index.";
      msg.channel.send(img);
    }
  }
}

// };