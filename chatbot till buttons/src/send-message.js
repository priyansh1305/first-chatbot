require("dotenv").config();
const {
  Client,
  IntentsBitField,
  InteractionCollector,
  EmbedBuilder,
  Embed,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});
const roles = [
  {
    id: "1283439891610341470",
    label: "Developer",
  },
  {
    id: "1283439988322598985",
    label: "Gamer-minecraft",
  },
  {
    id: "1283440102256939048",
    label: "Gamer-valorant",
  },
];
client.on("ready", async (c) => {
  try {
    const channel = await client.channels.cache.get("1283441459160154123");
    if (!channel) return;

    const row = new ActionRowBuilder();

    roles.forEach((role) => {
      row.components.push(
        new ButtonBuilder()
          .setCustomId(role.id)
          .setLabel(role.label)
          .setStyle(ButtonStyle.Primary)
      );
    });

    channel.send({
      content: "Claim your roles or remove it !",
      components: [row],
    });
    process.exit;
  } catch (error) {
    console.log(error);
  }
});
client.login(process.env.TOKEN);
