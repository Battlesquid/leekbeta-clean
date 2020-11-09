import fs from "fs";
import { Client, Collection, ClientOptions } from "discord.js"
import { Command, BotSettings, RequireDirectoryOptions, RequireDirectoryModules } from "./interfaces";
import * as _path from "path";

export default class Bot extends Client {
    private _commands: Collection<string, Command> = new Collection();;
    private _components: Map<string, any> = new Map();
    readonly prefix: string;

    constructor(settings: BotSettings, clientOptions?: ClientOptions) {
        super(clientOptions);
        this.prefix = settings.prefix;
    }

    init(cmdDir: string, eventsDir: string, token: string) {
        if (token === "undefined") return console.log("An invalid token was provided");
        this._loadCommands(cmdDir);
        console.log("Commands:\n", this._commands, "\n");
        this._loadEvents(eventsDir);
        this.login(token);
    }

    loadComponents(path: string, match: RegExp | string) {
        const components = this.requireDirectory(path, {
            recursive: true,
            filter: match
        })

        for (const value of Object.values(components)) {
            value.default ?
                this._components.set(value.default.name, value.default) :
                this._components.set(value.name, value);
        }
        console.log("Components:\n", this._components, "\n");
    }

    public getComponent(name: string) {
        return this._components.get(name);
    }

    private _loadCommands(path: string) {
        const commands = this.requireDirectory(path, {
            recursive: true,
            filter: /^([A-Za-z]+)(\.js)$/
        });

        for (const [name, command] of Object.entries(commands)) {
            this._commands.set(name, command.default);
        }
    }

    public getCommands(): Collection<string, Command> {
        return this._commands;
    }

    private _loadEvents(path: string) {
        const events = this.requireDirectory(path, {
            recursive: true,
            filter: /^([A-Za-z]+)(\.js)$/
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