require("dotenv").config();
const { REST, Routes } = require("discord.js");

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

(async () => {
  try {
    // Fetch and delete global commands
    console.log("Fetching global commands to delete...");
    const globalCommands = await rest.get(
      Routes.applicationCommands(process.env.CLIENT_ID)
    );

    console.log(`Found ${globalCommands.length} global commands.`);

    for (const command of globalCommands) {
      console.log(`Deleting global command: ${command.name}`);
      await rest.delete(
        Routes.applicationCommand(process.env.CLIENT_ID, command.id)
      );
    }

    console.log("All global commands have been deleted.");

    // Fetch and delete guild commands
    if (process.env.GUILD_ID) {
      console.log("Fetching guild commands to delete...");
      const guildCommands = await rest.get(
        Routes.applicationGuildCommands(
          process.env.CLIENT_ID,
          process.env.GUILD_ID
        )
      );

      console.log(`Found ${guildCommands.length} guild commands.`);

      for (const command of guildCommands) {
        console.log(`Deleting guild command: ${command.name}`);
        await rest.delete(
          Routes.applicationGuildCommand(
            process.env.CLIENT_ID,
            process.env.GUILD_ID,
            command.id
          )
        );
      }

      console.log("All guild commands have been deleted.");
    } else {
      console.log("No guild ID provided; skipping guild commands.");
    }
  } catch (error) {
    console.error(`There was an error: ${error}`);
  }
})();
