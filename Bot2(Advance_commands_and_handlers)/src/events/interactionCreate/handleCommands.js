const { Permissions } = require("discord.js");
const { devs, testServer } = require("../../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");

module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return; // Ensure it's a chat input command

  const localCommands = getLocalCommands();

  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!commandObject) return;

    // Ensure interaction is happening in a guild (server), otherwise return
    if (!interaction.guild) {
      return interaction.reply({
        content: "This command can only be run in a server.",
        ephemeral: true,
      });
    }

    // Developer-only command check
    if (commandObject.devonly) {
      if (!devs.includes(interaction.member?.id)) {
        return interaction.reply({
          content: `Only developers are allowed to run this command.`,
          ephemeral: true,
        });
      }
    }

    // Test server-only command check
    if (commandObject.testonly) {
      if (interaction.guild.id !== testServer) {
        return interaction.reply({
          content: `This command cannot be run here.`,
          ephemeral: true,
        });
      }
    }

    // Check if the user has required permissions
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permissions.has(permission)) {
          return interaction.reply({
            content: `You do not have enough permissions to run this command.`,
            ephemeral: true,
          });
        }
      }
    }

    // Check if the bot has the required permissions
    const bot = interaction.guild.members.me;
    if (!bot) {
      console.error("Bot member is undefined.");
      return;
    }

    if (commandObject.botpermissions?.length) {
      for (const permission of commandObject.botpermissions) {
        if (!bot.permissions.has(permission)) {
          return interaction.reply({
            content: "I don't have enough permissions to execute this command.",
            ephemeral: true,
          });
        }
      }
    }

    // Execute the command callback
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error: "${error}".`);
  }
};
