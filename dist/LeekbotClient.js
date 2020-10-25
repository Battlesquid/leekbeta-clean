"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = __importDefault(require("fs"));
const discord_js_1 = require("discord.js");
const _path = __importStar(require("path"));
class Bot extends discord_js_1.Client {
    constructor(settings, clientOptions) {
        super(clientOptions);
        this.commands = new discord_js_1.Collection();
        this.components = new Map();
        this.prefix = settings.prefix;
    }
    ;
    init(cmdDir, eventsDir, token) {
        if (token === "undefined")
            return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        console.log(this.commands);
        this.loadEvents(eventsDir);
        this.login(token);
    }
    loadComponents(path, match) {
        const components = this.requireDirectory(path, {
            recursive: true,
            filter: match
        });
        for (const [key, value] of Object.entries(components)) {
            value.default ?
                this.components.set(value.default.name, value.default) :
                this.components.set(value.name, value);
        }
        console.log(this.components);
    }
    getComponent(name) {
        return this.components.get(name);
    }
    loadCommands(path) {
        const commands = this.requireDirectory(path, {
            recursive: true
        });
        for (const [name, command] of Object.entries(commands)) {
            this.commands.set(name, command.default);
        }
    }
    getCommands() {
        return this.commands;
    }
    loadEvents(path) {
        const events = this.requireDirectory(path, {
            recursive: true
        });
        for (const [eventName, event] of Object.entries(events)) {
            this.on(eventName, event.default.bind(null, this));
            delete require.cache[require.resolve(`./events/${eventName}`)];
        }
    }
    requireDirectory(path, options) {
        const modules = {};
        function readDir(dir) {
            const resolvedDir = _path.resolve(".", dir);
            const contents = fs_1.default.readdirSync(resolvedDir);
            const files = contents
                .filter(item => fs_1.default.lstatSync(`${resolvedDir}/${item}`).isFile())
                .filter(item => item.match((options === null || options === void 0 ? void 0 : options.filter) || /.+/))
                .map((file, index, filesArray) => {
                const length = filesArray.filter(x => x === file).length - filesArray.slice(index).filter(x => x === file).length;
                return length > 0 ? file + length : file;
            }); // prevent duplicates
            const subDirs = contents
                .filter(item => fs_1.default.lstatSync(`${resolvedDir}/${item}`).isDirectory())
                .map(folder => `${dir}/${folder}`);
            if (files.length) {
                files.forEach(file => modules[file.split(".")[0]] = require(`${resolvedDir}/${file}`));
            }
            if ((options === null || options === void 0 ? void 0 : options.recursive) && subDirs.length)
                subDirs.forEach(sub => readDir(sub));
        }
        readDir(path);
        return modules;
    }
}
exports.default = Bot;
