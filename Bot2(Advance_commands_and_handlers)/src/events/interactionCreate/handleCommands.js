const { ConnectionService } = require("discord.js");
const { devs, testServer } = require("../../../../config.json");
const getLocalCommands = require("../../utils/getLocalCommands");
module.exports = async (client, interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const localCommands = getLocalCommands();
  try {
    const commandObject = localCommands.find(
      (cmd) => cmd.name === interaction.commandName
    );
    if (!commandObject) return;

    if (commandObject.devonly) {
      if (!devs.includes(interaction.member.id)) {
        interaction.reply({
          content: `Only developers are allowed to run this commands.`,
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.testonly) {
      if (!(interaction.guild.id === testServer)) {
        interaction.reply({
          content: `This command cannot be ran here`,
          ephemeral: true,
        });
        return;
      }
    }
    if (commandObject.permissionsRequired?.length) {
      for (const permission of commandObject.permissionsRequired) {
        if (!interaction.member.permission.has(permission)) {
          interaction.reply({
            content: `Not enough permissions.`,
            ephemeral: true,
          });
          break;
        }
      }
    }
    if (commandObject.botpermissions?.length) {
      for (const permission of commandObject.botpermissions) {
        const bot = interaction.guild.member;
        if (!bot.permission.has(permission)) {
          interaction.reply({
            content: "i dont have enough permissions.",
            ephemeral: true,
          });
          break;
        }
      }
    }
    await commandObject.callback(client, interaction);
  } catch (error) {
    console.log(`There was an error "${error}".`);
  }
};
