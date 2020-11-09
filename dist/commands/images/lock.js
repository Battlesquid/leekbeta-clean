"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
exports.default = {
    run(bot, message, args) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const channelIDs = message.mentions.channels.map(channel => channel.id);
            const conditionDB = bot.getComponent("ConditionHandler").database;
            for (const channelID of channelIDs) {
                yield conditionDB.addCondition((_a = message.guild) === null || _a === void 0 ? void 0 : _a.id, channelID, "locked");
            }
            message.channel.send(`${message.mentions.channels} is/are image locked.`);
        });
    },
    meetsRequirements(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const requirements = [
                (_a = message.member) === null || _a === void 0 ? void 0 : _a.hasPermission(this.permission),
                message.mentions.channels.size > 0
            ];
            return requirements.every(Boolean);
        });
    },
    usage: "...<#channels>",
    permission: discord_js_1.Permissions.FLAGS.MANAGE_CHANNELS
};
//# sourceMappingURL=lock.js.map