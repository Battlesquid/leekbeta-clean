"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var discord_js_1 = require("discord.js");
var Bot = /** @class */ (function () {
    function Bot(settings, clientOptions) {
        this.commands = new discord_js_1.Collection();
        this.components = new Map();
        this.client = new discord_js_1.Client(clientOptions);
        this.prefix = settings.prefix;
    }
    ;
    Bot.prototype.init = function (cmdDir, eventsDir, token) {
        if (token === "undefined")
            return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        console.log(this.commands);
        this.loadEvents(eventsDir);
        this.client.login(token);
    };
    Bot.prototype.loadComponents = function (path) {
        var components = this.requireDirectory(path, {
            recursive: true,
            filter: /^component\.js$/
        });
        console.log(components);
        // const contents = fs.readdirSync(path);
        // console.log(contents);
        // contents.forEach(file => {
        //     const component: Component = require(`${path}/${file}`);
        //     this.components.set(component.name, component);
        // })
    };
    Bot.prototype.getComponent = function (name) {
        return this.components.get(name);
    };
    Bot.prototype.loadCommands = function (path) {
        var commands = this.requireDirectory(path, {
            recursive: true
        });
        for (var _i = 0, _a = Object.entries(commands); _i < _a.length; _i++) {
            var _b = _a[_i], name_1 = _b[0], module_1 = _b[1];
            this.commands.set(name_1, module_1.default);
        }
    };
    Bot.prototype.getCommands = function () {
        return this.commands;
    };
    Bot.prototype.loadEvents = function (path) {
        var events = this.requireDirectory(path, {
            recursive: true
        });
        console.log(events);
        for (var _i = 0, _a = Object.entries(events); _i < _a.length; _i++) {
            var _b = _a[_i], eventName = _b[0], event_1 = _b[1];
            this.client.on(eventName, event_1.default.bind(null, this));
            delete require.cache[require.resolve("./events/" + eventName)];
        }
    };
    Bot.prototype.requireDirectory = function (path, options) {
        var modules = {};
        function readDir(dir) {
            var contents = fs_1.default.readdirSync(dir);
            var files = contents
                .filter(function (item) { return fs_1.default.lstatSync(dir + "/" + item).isFile(); })
                .filter(function (item) { return item.match((options === null || options === void 0 ? void 0 : options.filter) || /.+/); });
            var subDirs = contents
                .filter(function (item) { return fs_1.default.lstatSync(dir + "/" + item).isDirectory(); })
                .map(function (folder) { return dir + "/" + folder; });
            if (files.length)
                files.forEach(function (file) { return modules[file.split(".")[0]] = require(dir + "/" + file); });
            if ((options === null || options === void 0 ? void 0 : options.recursive) && subDirs.length)
                subDirs.forEach(function (sub) { return readDir(sub); });
        }
        readDir(path);
        return modules;
    };
    return Bot;
}());
exports.default = Bot;
