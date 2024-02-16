const { DiscussServiceClient } = require("@google-ai/generativelanguage");
const { GoogleAuth } = require("google-auth-library");

const { db, addMsg, clearMsgs } = require("../utils.js");

const datas = db.getData();

const MODEL_NAME = "models/chat-bison-001";

const AIclient = new DiscussServiceClient({
  authClient: new GoogleAuth().fromAPIKey("AIzaSyA6B01DPsXtGIhUQjckCshbD1E99Edd2Tg"),
});


const MAX_RETRIES = 5;



module.exports = {

  name: 'ask',
  aliases: ['ai', 'ask'],
  description: 'ask anything from ai.',
  minArgs: 1,
  usage: '<prompt>',
  exec: async (client, msg, args) => {

    let msgContent = msg.content.trim().split(" ");
    msgContent.shift();

    let retries = 0;
    let answer;

    let prompt = msgContent.join(" ");

    addMsg(prompt, msg.author.id, client);

    async function startResponse() {

      let messages = db.getData(msg.author.id).msgs;

      try {
        while (retries < MAX_RETRIES) {
          msg.channel.send("processing...")
          const result = await AIclient.generateMessage({
            model: MODEL_NAME, // Required. The model to use to generate the result.
            temperature: (retries + 1.6) * 0.1, // Optional. Value `0.0` always uses the highest-probability result.
            candidateCount: 1, // Optional. The number of candidate results to generate.
            maxOutputTokens: 1500, // Optional. The maximum number of tokens in the generated text.
            prompt: {
              // optional, preamble context to prime responses
              context: "you are Ray-ai and your name is Ray-ai , your task is to help people , and also help programmers.",
              // Optional. Examples for further fine-tuning of responses.

              // Required. Alternating prompt/response messages.
              messages
            },
          });

          if (result[0]?.candidates[0]?.content) {
            answer = result[0].candidates[0].content;
            break;
          } else {
            messages.push({ content: "hmm" });
            retries++;
            console.log(result[0]);
          }

        }
      } catch (e) {
        if (e.message.includes("INVALID_ARGUMENT: Request payload size exceeds the limit: 20000 bytes")) {
          clearMsgs(msg.author.id, messages.length / 3)
          await startResponse();
        } else {
          msg.channel.send(`ERROR: ${e}`);
        }
      }

    }

    await startResponse();

    if (answer) {

      if (answer.length > 2000) {
        msg.channel.send(answer.substring(0, 1997) + "...");
        addMsg(answer, msg.author.id, client);
      } else {
        msg.channel.send(answer);
        addMsg(answer, msg.author.id, client);
      }

    } else {

      msg.channel.send("I am sorry , can u clearify??");
      addMsg("I am sorry , can u clearify??", msg.author.id, client);

    }
  }

};
