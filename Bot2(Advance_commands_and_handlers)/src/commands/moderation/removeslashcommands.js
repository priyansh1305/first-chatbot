const { REST, Routes } = require("discord.js");
require("dotenv").config(); // Load environment variables from .env

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // Optionally set the guild ID for guild commands

const rest = new REST({ version: "10" }).setToken(token);

module.exports = {
  name: "removeslashcommands",
  description: "Fetch and remove global or guild slash commands by name",
  devonly: true,
  options: [
    {
      name: "command-name",
      description: "The name of the command you want to remove.",
      required: true,
      type: 3, // String type for command name
    },
    {
      name: "scope",
      description:
        "Specify if it's a global or guild command (default is global).",
      required: false,
      type: 3, // String type for scope, either 'global' or 'guild'
      choices: [
        { name: "global", value: "global" },
        { name: "guild", value: "guild" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const commandName = interaction.options.getString("command-name"); // Get the command name
    const scope = interaction.options.getString("scope") || "global"; // Get scope (global or guild)

    // Defer reply to handle long processing times
    await interaction.deferReply({ ephemeral: true });

    try {
      let commands;

      // Fetch either global or guild-specific commands
      if (scope === "guild") {
        if (!guildId) {
          await interaction.editReply({
            content: `❌ Guild ID is not set in the environment variables.`,
          });
          return;
        }
        commands = await rest.get(
          Routes.applicationGuildCommands(clientId, guildId)
        );
      } else {
        commands = await rest.get(Routes.applicationCommands(clientId));
      }

      // Find the command by name
      const commandToDelete = commands.find((cmd) => cmd.name === commandName);

      if (!commandToDelete) {
        await interaction.editReply({
          content: `❌ Command with name "${commandName}" not found.`,
        });
        return;
      }

      // Delete the command
      if (scope === "guild") {
        await rest.delete(
          Routes.applicationGuildCommand(clientId, guildId, commandToDelete.id)
        );
      } else {
        await rest.delete(
          Routes.applicationCommand(clientId, commandToDelete.id)
        );
      }

      await interaction.editReply({
        content: `✅ Successfully deleted the command "${commandToDelete.name}".`,
      });
    } catch (error) {
      console.error("Error deleting command:", error);
      await interaction.editReply({
        content: `❌ There was an error deleting the command.`,
      });
    }
  },
};
