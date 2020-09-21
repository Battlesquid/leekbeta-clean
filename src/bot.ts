import fs from "fs";
import { Client, Collection } from "discord.js"
import { Command, BotSettings, Component, RequireDirectoryOptions, RequireDirectoryModules } from "./interfaces";

export default class Bot {
    private client: Client;
    private commands: Collection<string, Command> = new Collection();;
    private components: Map<string, any> = new Map();
    readonly prefix: string;

    constructor(settings: BotSettings, clientOptions?: object) {
        this.client = new Client(clientOptions);
        this.prefix = settings.prefix;
    }

    public init(cmdDir: string, eventsDir: string, token: string) {
        if (token === "undefined") return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        console.log(this.commands);
        this.loadEvents(eventsDir);
        this.client.login(token);
    }

    public loadComponents(path: string) {
        const components = this.requireDirectory(path, {
            recursive: true,
            filter: /^component\.js$/
        })
        console.log(components);

        // const contents = fs.readdirSync(path);

        // console.log(contents);
        // contents.forEach(file => {
        //     const component: Component = require(`${path}/${file}`);
        //     this.components.set(component.name, component);
        // })
    }

    public getComponent(name: string) {
        return this.components.get(name);
    }

    private loadCommands(path: string) {
        const commands = this.requireDirectory(path, {
            recursive: true
        });

        for (const [name, module] of Object.entries(commands)) {
            this.commands.set(name, module.default);
        }
    }

    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    private loadEvents(path: string) {
        const events = this.requireDirectory(path, {
            recursive: true
        });

        console.log(events);

        for (const [eventName, event] of Object.entries(events)) {
            this.client.on(eventName, event.default.bind(null, this));
            delete require.cache[require.resolve(`./events/${eventName}`)];
        }
    }

    private requireDirectory(path: string, options?: RequireDirectoryOptions): RequireDirectoryModules {
        const modules: RequireDirectoryModules = {};

        function readDir(dir: string) {
            const contents = fs.readdirSync(dir);

            const files = contents
                .filter(item => fs.lstatSync(`${dir}/${item}`).isFile())
                .filter(item => item.match(options?.filter || /.+/))

            const subDirs = contents
                .filter(item => fs.lstatSync(`${dir}/${item}`).isDirectory())
                .map(folder => `${dir}/${folder}`);

            if (files.length)
                files.forEach(file => modules[file.split(".")[0]] = require(`${dir}/${file}`))

            if (options?.recursive && subDirs.length) subDirs.forEach(sub => readDir(sub))
        }

        readDir(path);

        return modules;
    }
}