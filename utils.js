const fs = require("fs");
const Discord = require("discord.js");
const database = require("./database.js");
const db = new database("users");
const puppeteer = require('puppeteer');




var writeDB = (id, amount, client) => {

  // if (typeof amount == "number" || amount.isNumber()) {

  let data = db.getData(id);
  data.cash += parseInt(amount);
  db.writeData(id, data);


  // }

};

var addMsg = (content, id, client) => {
  let data = db.getData(id);
  data.msgs = "msgs" in data ? data.msgs : [];
  data.msgs.push({ content });
  db.writeData(id, data);
};

var clearMsgs = (id, deleteItems) => {
  let data = db.getData(id);
  if (deleteItems) {
    data.msgs.splice(0, +deleteItems)
  } else {
    data.msgs = [];
  }
  db.writeData(id, data);
}


function createUser(id, client) {
  db.writeData(id, 10000);
  console.log(`${client.users.cache.get(id).username}${client.users.cache.get(id).discriminator}  ------------->  ( joined )`);

};

function addLog(text) {
  fs.appendFileSync("log.txt", text + "\n");
}


module.exports = {
  createUser,
  writeDB,
  db,
  addLog,
  addMsg,
  clearMsgs,
  Discord
}