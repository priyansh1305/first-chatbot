const { ActivityType } = require("discord.js");
module.exports = (client) => {
  client.user.setActivity({
    name: "PSG Slave bot",
    type: ActivityType.Streaming,
  });
};
