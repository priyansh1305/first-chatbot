const {
  Client,
  Interaction,
  ApplicationCommandOptionType,
  PermissionFlagsBits,
} = require("discord.js");

module.exports = {
  name: "ban",
  description: "Bans a member from this server.",
  //devonly : Boolean,
  //testonly : Boolean,
  //deleted: true,

  options: [
    {
      name: "target-user",
      description: "the user you want to ban.",
      required: true,
      type: ApplicationCommandOptionType.Mentionable,
    },
    {
      name: "reason",
      description: "The reason for banning.",
      type: ApplicationCommandOptionType.String,
    },
  ],
  permissionsRequired: [PermissionFlagsBits.BanMembers],
  botpermissions: [PermissionFlagsBits.BanMembers],
  /**
   *
   * @param {Client} client
   * @param {Interaction} interaction
   */
  callback: async (client, interaction) => {
    const tragetUserId = interaction.options.get("target-user").value;
    const reason =
      interaction.options.get("reason")?.value || "No reason Provided";
    await interaction.deferReply();
    const targetUser = await interaction.guild.members.fetch(tragetUserId);
    if (!targetUser) {
      await interaction.editReply("That iser doesn't exist in this server.");
      return;
    }
    if (tragetUserId === interaction.guild.ownerId) {
      await interaction.editReply(
        "You can't ban that user because they are the server owner."
      );
      return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //Highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; //Highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; //Highest role of the bot

    if (targetUserRolePosition >= requestUserRolePosition) {
      await interaction.editReply(
        "you can't ban the user because they have the same/higher role than you."
      );
      return;
    }

    if (targetUserRolePosition >= botRolePosition) {
      await interaction.editReply(
        "I cant ban that user because they have the same/hgiher role than me."
      );
      return;
    }
    // Ban the targetuser
    try {
      await targetUser.ban({ reason });
      await interaction.editReply(
        `**User**:${targetUser} was banned \n**reason**: ${reason}`
      );
    } catch (error) {
      console.log(`There was an error when banning: ${error},`);
    }
  },
};
