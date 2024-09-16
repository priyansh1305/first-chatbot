const { REST, Routes } = require("discord.js");
require("dotenv").config(); // Load environment variables from .env

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;

const rest = new REST({ version: "10" }).setToken(token);

module.exports = {
  name: "removeslashcommands",
  description: "Fetch and remove global slash commands by ID",
  options: [
    {
      name: "command-id",
      description: "The ID of the command you want to remove.",
      required: true,
      type: 3, // String type for command ID
    },
  ],

  callback: async (client, interaction) => {
    const commandId = interaction.options.getString("command-id"); // Get the command ID

    try {
      // Fetch all global slash commands
      const globalCommands = await rest.get(
        Routes.applicationCommands(clientId)
      );

      // Check if the command ID exists in global commands
      const commandToDelete = globalCommands.find(
        (cmd) => cmd.id === commandId
      );

      if (!commandToDelete) {
        await interaction.reply({
          content: `❌ Command with ID "${commandId}" not found.`,
          ephemeral: true,
        });
        return;
      }

      // Delete the command
      await rest.delete(Routes.applicationCommand(clientId, commandId));
      await interaction.reply({
        content: `✅ Successfully deleted the command "${commandToDelete.name}" (ID: ${commandId}).`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error deleting command:", error);
      await interaction.reply({
        content: `❌ There was an error deleting the command.`,
        ephemeral: true,
      });
    }
  },
};
