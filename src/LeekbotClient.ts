import fs from "fs";
import { Client, Collection, ClientOptions } from "discord.js"
import { Command, BotSettings, RequireDirectoryOptions, RequireDirectoryModules } from "./interfaces";
import * as _path from "path";

export default class Bot extends Client {
    private commands: Collection<string, Command> = new Collection();;
    private components: Map<string, any> = new Map();
    readonly prefix: string;

    constructor(settings: BotSettings, clientOptions?: ClientOptions) {
        super(clientOptions);
        this.prefix = settings.prefix;
    }

    public init(cmdDir: string, eventsDir: string, token: string) {
        if (token === "undefined") return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        console.log(this.commands);
        this.loadEvents(eventsDir);
        this.login(token);
    }

    public loadComponents(path: string, match: RegExp | string) {
        const components = this.requireDirectory(path, {
            recursive: true,
            filter: match
        })

        for (const [key, value] of Object.entries(components)) {
            value.default ?
                this.components.set(value.default.name, value.default) :
                this.components.set(value.name, value);
        }
        console.log(this.components);
    }

    public getComponent(name: string) {
        return this.components.get(name);
    }

    private loadCommands(path: string) {
        const commands = this.requireDirectory(path, {
            recursive: true
        });

        for (const [name, command] of Object.entries(commands)) {
            this.commands.set(name, command.default);
        }
    }

    public getCommands(): Collection<string, Command> {
        return this.commands;
    }

    private loadEvents(path: string) {
        const events = this.requireDirectory(path, {
            recursive: true
        });

        for (const [eventName, event] of Object.entries(events)) {
            this.on(eventName, event.default.bind(null, this));
            delete require.cache[require.resolve(`./events/${eventName}`)];
        }
    }

    private requireDirectory(path: string, options?: RequireDirectoryOptions): RequireDirectoryModules {
        const modules: RequireDirectoryModules = {};

        function readDir(dir: string) {
            const resolvedDir: string = _path.resolve(".", dir);
            const contents = fs.readdirSync(resolvedDir);

            const files = contents
                .filter(item => fs.lstatSync(`${resolvedDir}/${item}`).isFile())
                .filter(item => item.match(options?.filter || /.+/))
                .map((file, index, filesArray) => {
                    const length: number = filesArray.filter(x => x === file).length - filesArray.slice(index).filter(x => x === file).length
                    return length > 0 ? file + length : file;
                }) // prevent duplicates

            const subDirs = contents
                .filter(item => fs.lstatSync(`${resolvedDir}/${item}`).isDirectory())
                .map(folder => `${dir}/${folder}`);

            if (files.length) {
                files.forEach(file => modules[file.split(".")[0]] = require(`${resolvedDir}/${file}`))
            }

            if (options?.recursive && subDirs.length) subDirs.forEach(sub => readDir(sub))
        }

        readDir(path);

        return modules;
    }
}