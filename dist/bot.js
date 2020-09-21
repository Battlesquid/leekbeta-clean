"use strict";
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = __importDefault(require("fs"));
var discord_js_1 = require("discord.js");
var ConditionHandler_1 = __importDefault(require("./ConditionHandler"));
var Bot = /** @class */ (function () {
    function Bot(settings, clientOptions) {
        this.ConditionHandler = new ConditionHandler_1.default("./conditions");
        this.client = new discord_js_1.Client(clientOptions);
        this.commands = new discord_js_1.Collection();
        this.prefix = settings.prefix;
    }
    Bot.prototype.init = function (cmdDir, eventsDir, token) {
        if (token === "undefined")
            return console.log("An invalid token was provided");
        this.loadCommands(cmdDir);
        this.loadEvents(eventsDir);
        this.client.login(token);
    };
    Bot.prototype.handleConditions = function (guild, channel) {
        this.ConditionHandler.handleConditions(guild, channel);
    };
    Bot.prototype.getPrefix = function () {
        return this.prefix;
    };
    Bot.prototype.getCommands = function () {
        return this.commands;
    };
    Bot.prototype.loadCommands = function (paths) {
        var _this = this;
        paths.forEach(function (path) {
            var contents = fs_1.default.readdirSync(path);
            var jsFiles = __spreadArrays(contents.filter(function (cmd) { return cmd.endsWith(".js"); }));
            var subFolders = __spreadArrays(contents.filter(function (cmd) { return !cmd.match(/\..+/); }));
            var subDirs = subFolders.map(function (dir) { return path + "/" + dir; });
            for (var _i = 0, jsFiles_1 = jsFiles; _i < jsFiles_1.length; _i++) {
                var file = jsFiles_1[_i];
                var cmd = require(path + "/" + file).default;
                _this.commands.set(file.split(".")[0], cmd);
            }
            if (subDirs)
                _this.loadCommands(subDirs);
        });
    };
    Bot.prototype.loadEvents = function (path) {
        var contents = fs_1.default.readdirSync(path);
        var validEvents = __spreadArrays(contents
            .filter(function (item) { return item.endsWith(".js"); })
            .map(function (event) { return event.split(".")[0]; }));
        for (var _i = 0, validEvents_1 = validEvents; _i < validEvents_1.length; _i++) {
            var event_1 = validEvents_1[_i];
            var eventFile = require("./events/" + event_1).default;
            this.client.on(event_1, eventFile.bind(null, this));
            delete require.cache[require.resolve("./events/" + event_1)];
        }
    };
    return Bot;
}());
exports.default = Bot;
