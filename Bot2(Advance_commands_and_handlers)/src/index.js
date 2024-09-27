require("dotenv").config();
const {
  Client,
  IntentsBitField,
  InteractionCollector,
  EmbedBuilder,
  Embed,
  ActivityType,
} = require("discord.js");
const mongoose = require("mongoose");
const eventHandler = require("./handlers/eventHandler");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
(async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  try {
    console.log("connected to DB.");
    client.login(process.env.TOKEN);
    eventHandler(client);
  } catch (error) {
    console.log(`Error:${error}`);
  }
})();
