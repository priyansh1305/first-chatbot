const { ApplicationCommandOptionType } = require("discord.js");

module.exports = {
  name: "add",
  description: "add two numbers",
  options: [
    {
      name: "first-number",
      description: "the first number",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
    {
      name: "second-number",
      description: "the second number",
      type: ApplicationCommandOptionType.Number,
      required: true,
    },
  ],
  callback: (client, interaction) => {
    const num1 = interaction.options.get("first-number").value;
    const num2 = interaction.options.get("second-number").value;
    interaction.reply(`The sum of two numbers is :${num1 + num2}`);
  },
};
