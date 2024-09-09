require('dotenv').config();
const  { REST , Routes , CommandInteraction, Options, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
        name: 'hey',
        description: 'replies with hey!',

    },
    {
        name: 'ping',
        description: 'Pong!',

    },
    {
        name: 'add',
        description: 'Add two numbers.',
        options: [
            {
                name: 'first-number',
                description: 'The first number.',
                type: ApplicationCommandOptionType.Number,
                choices: [
                    {
                        name: 'one',
                        value: 1,
                    },
                    {
                        name: 'can add options here rn its 2',
                        value: 2,
                    },
                    {
                        name: 'here its 3 ',
                        value: 3,
                    },
                ],
                required: true,
            },
            {
                name: 'second-number',
                description: 'The second number.',
                type: ApplicationCommandOptionType.Number,
                required: true,
            },
        ]

    },
];

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);
(async () => {
    try {
        console.log('Registering slash commands...');
        await rest.put(
            Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
            {body: commands}

        );

        console.log('SLash command were registered successfully!');
    } catch (error) {
        console.log(`There was an error: ${error}`);
    }
})();