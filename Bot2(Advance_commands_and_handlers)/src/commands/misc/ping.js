module.exports = {
  name: "pingg",
  description: "pong!!!",
  //devonly : Boolean,
  // testonly : Boolean,
  //options: Object[],
  //deleted: true,

  callback: (client, interaction) => {
    interaction.reply(`Pong! ${client.ws.ping}ms`);
  },
};
