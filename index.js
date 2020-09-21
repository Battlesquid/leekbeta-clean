require('dotenv').config();
const fs = require("fs");

const bot = new eris.CommandClient(process.env.TOKEN, {}, {
    description: "leekbot, a helpful discord bot",
    owner: "battlesqui_d#3316",
    prefix: ";"
})

const loadCommands = paths => {
    paths.forEach(path => {
        const contents = fs.readdirSync(path);
        const jsFiles = [], subDirs = [];

        for (const file of contents)
            file.endsWith(".js") ? jsFiles.push(file) : subDirs.push(`${path}/${file}`);

        for (const file of jsFiles) {
            const cmd = require(`${path}/${file}`);
            console.log(file);
            if (cmd.fn && cmd.options)
                bot.registerCommand(file.split(".")[0], cmd.fn, cmd.options)
        }

        if (subDirs) loadCommands(subDirs)
    })
}

bot.connect();
function loadEvents(path) {
    const items = fs.readdirSync(path);
    for (const file of items) {
        if (file.endsWith(".js")) {
            const event = require(`./events/${file}`);
            let eventName = file.split(".js")[0];
            bot.on(eventName, event.bind(null, bot));
            delete require.cache[require.resolve(`./events/${file}`)];
        }
    }
}
// // bot.on("ready", () => {
// //     bot.user.setPresence({
// //         activity: {
// //             name: `for messages | https://bit.ly/2AHXtXs`,
// //             type: "WATCHING"
// //         },
// //         status: "idle"
// //     });
// //     console.log("Loading commands...");
// //     loadCommands(["./commands"], "commands", false);

// //     console.log("Loading events...");
// //     // loadEvents("./events");
// //     // initBatchVerifyScheduler(bot);
// //     console.log("Ready");
// // });

bot.login(process.env.TOKEN);