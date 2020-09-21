import fs from "fs";
import { Client, Collection } from "discord.js"
import { Command, BotSettings, Component } from "./interfaces";

export default class Bot {
    private client: Client;
    private commands: Collection<string, Command>;
    private components: Map<string, any> = new Map();
    private prefix: string;

    constructor(settings: BotSettings, clientOptions?: object) {
        this.client = new Client(clientOptions);
        this.commands = new Collection();
        this.prefix = settings.prefix;
    }

    public init(cmdDir: Array<string>, eventsDir: string, token: string) {
        if (token === "undefined") return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        this.loadEvents(eventsDir);
        this.client.login(token);
    }

    public getPrefix(): string {
        return this.prefix;
    }

    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    public registerComponent(components: Component | Array<Component>) {
        if (Array.isArray(components))
            components.forEach(component =>
                this.components.set(component.name, component))
        else
            this.components.set(components.name, components)
    }

    public getComponent(name: string) {
        return this.components.get(name);
    }

    private loadCommands(paths: Array<string>) {
        paths.forEach(path => {
            const contents = fs.readdirSync(path);

            const jsFiles = [...contents.filter(cmd => cmd.endsWith(".js"))]
            const subFolders = [...contents.filter(cmd => !cmd.match(/\..+/))];
            const subDirs = subFolders.map(dir => `${path}/${dir}`);

            for (const file of jsFiles) {
                const cmd: Command = require(`${path}/${file}`).default;
                this.commands.set(file.split(".")[0], cmd);
            }

            if (subDirs) this.loadCommands(subDirs)
        })
    }

    private loadEvents(path: string) {
        const contents = fs.readdirSync(path);
        const validEvents = [
            ...contents
                .filter(item => item.endsWith(".js"))
                .map(event => event.split(".")[0])
        ];

        for (const event of validEvents) {
            const eventFile = require(`./events/${event}`).default;
            this.client.on(event, eventFile.bind(null, this));
            delete require.cache[require.resolve(`./events/${event}`)];
        }
    }
}