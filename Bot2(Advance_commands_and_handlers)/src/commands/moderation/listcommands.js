const { REST, Routes } = require("discord.js");
require("dotenv").config();

const token = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID; // For guild-specific commands

const rest = new REST({ version: "10" }).setToken(token);

module.exports = {
  name: "listcommands",
  description: "List all global or guild slash commands",
  devonly: true,
  options: [
    {
      name: "scope",
      description:
        "Specify if you want to list global or guild commands (default is global).",
      required: false,
      type: 3, // String type
      choices: [
        { name: "global", value: "global" },
        { name: "guild", value: "guild" },
      ],
    },
  ],

  callback: async (client, interaction) => {
    const scope = interaction.options.getString("scope") || "global"; // Default to global commands

    try {
      let commands;

      // Fetch either global or guild-specific commands
      if (scope === "guild") {
        if (!guildId) {
          return interaction.reply({
            content: `❌ Guild ID is not set in the environment variables.`,
            ephemeral: true,
          });
        }
        commands = await rest.get(
          Routes.applicationGuildCommands(clientId, guildId)
        );
      } else {
        commands = await rest.get(Routes.applicationCommands(clientId));
      }

      // If there are no commands, notify the user
      if (!commands || commands.length === 0) {
        return interaction.reply({
          content: `No ${scope} slash commands found.`,
          ephemeral: true,
        });
      }

      // List the commands
      const commandList = commands
        .map((cmd) => `**${cmd.name}** (ID: ${cmd.id})`)
        .join("\n");

      await interaction.reply({
        content: `Here are the ${scope} commands:\n${commandList}`,
        ephemeral: true,
      });
    } catch (error) {
      console.error("Error fetching commands:", error);
      await interaction.reply({
        content: `❌ There was an error fetching the ${scope} commands.`,
        ephemeral: true,
      });
    }
  },
};
