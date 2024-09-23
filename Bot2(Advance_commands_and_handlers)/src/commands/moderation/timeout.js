const {
  Client,
  Interaction,
  interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");
const ms = require("ms");
module.exports = {
  name: "timeout",
  description: "Timeout a user",
  options: [
    {
      name: "target-user",
      description: "The user you want to timeout.",
      type: ApplicationCommandOptionType.Mentionable,
      required: true,
    },
    {
      name: "duration",
      description: "Timeout duratiom (1m , 30m, 1h, 1 day).",
      type: ApplicationCommandOptionType.String,
      required: true,
    },
    {
      name: "reason",
      description: "The reason for the timeout.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.MuteMembers],
  botpermissions: [PermissionFlagsBits.MuteMembers],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */

  //logic
  callback: async (client, interaction) => {
    const mentionable = interaction.options.get("target-user").value;
    const duration = interaction.options.get("duration").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason provided";

    await interaction.deferReply();
    const targetUser = await interaction.guild.members.fetch(mentionable);
    if (!targetUser) {
      await interaction.editReply("That user doesn't exist in this server.");
      return;
    }
    if (targetUser.user.bot) {
      await interaction.editReply("I cannot timeout a bot.");
      return;
    }
    const msDuration = ms(duration);
    if (isNaN(msDuration)) {
      await interaction.editReply("Please provide a valid timeout format.");
      return;
    }
    if (msDuration < 5000 || msDuration > 2.419e9) {
      await interaction.editReply(
        "Timeout cannot be less that 5 seconds or more than 28 days."
      );
    }
    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; //Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "you can't timeout the user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cant timeout that user because they have the same/hgiher role than me."
      );
      return;
    }
    //timeout the user code
    try {
      const { default: prettyMs } = await import("pretty-ms");
      if (targetUser.isCommunicationDisabled()) {
        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(
          `${targetUser}'s timeout has been update to ${prettyMs(msDuration, {
            verbose: true,
          })}\nReason: ${reason} `
        );
        return;
      }
      await targetUser.timeout(msDuration, reason);
      await interaction.editReply(
        `${targetUser} was timed out for ${prettyMs(msDuration, {
          verbose: true,
        })}\nReason: ${reason}`
      );
    } catch (error) {
      console.log(`there was an error ${error}.`);
    }
  },
};
