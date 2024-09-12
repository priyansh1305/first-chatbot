require("dotenv").config();
const {
  Client,
  IntentsBitField,
  InteractionCollector,
  EmbedBuilder,
  Embed,
  ActivityType,
} = require("discord.js");

const client = new Client({
  intents: [
    IntentsBitField.Flags.Guilds,
    IntentsBitField.Flags.GuildMembers,
    IntentsBitField.Flags.GuildMessages,
    IntentsBitField.Flags.MessageContent,
  ],
});

client.on("ready", (c) => {
  console.log(`✅${c.user.tag} is online.`);

  client.user.setActivity({
    name: "PSG Slave bot",
    type: ActivityType.Streaming,
  });
});

client.on("messageCreate", (message) => {
  if (message.author.bot) {
    return;
  }
  if (message.content === "hello") {
    message.reply(`hey ${message.author}`);
  }
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isChatInputCommand() && !interaction.isButton()) return;

  try {
    //command handling

    if (interaction.isChatInputCommand()) {
      if (interaction.commandName === "hey") {
        await interaction.reply(`Hey! ${interaction.user}`);
      }
      if (interaction.commandName === "ping") {
        await interaction.reply(`Pong`);
      }
      if (interaction.commandName === "add") {
        const num1 = interaction.options.get("first-number").value;
        const num2 = interaction.options.get("second-number").value;
        await interaction.reply(`the sum is ${num1 + num2}`);
      }
      if (interaction.commandName === "embed") {
        const embed = new EmbedBuilder()
          .setTitle("Embed title")
          .setDescription("This is an embed description")
          .setColor("Random")
          .addFields(
            {
              name: "Field Title",
              value: "Some random value",
              inline: true,
            },
            {
              name: "2nd Field Title",
              value: "Some random value",
              inline: true,
            }
          );

        await interaction.reply({ embeds: [embed] });
      }
    }

    //Button Interaction handling

    if (interaction.isButton()) {
      await interaction.deferReply({ ephemeral: true });
      const role = interaction.guild.roles.cache.get(interaction.customId);
      if (!role) {
        interaction.editReply({
          content: "I couldn't find that role",
        });
        return;
      }

      const hasRole = interaction.member.roles.cache.has(role.id);
      if (hasRole) {
        await interaction.member.roles.remove(role);
        await interaction.editReply(`the role ${role} has been removed.`);
        return;
      }
      await interaction.member.roles.add(role);
      await interaction.editReply(`the role ${role} has been added.`);
    }
  } catch (error) {
    console.log(error);
  }
});

client.login(process.env.TOKEN);
