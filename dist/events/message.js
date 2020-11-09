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
exports.default = (bot, message) => __awaiter(void 0, void 0, void 0, function* () {
    if (message.author.bot || !message.guild)
        return;
    yield bot.getComponent("ConditionHandler").handleConditions("message", message.guild.id, message.channel.id, message);
    if (!message.content.startsWith(bot.prefix))
        return;
    const [commandName, ...args] = message.content
        .slice(bot.prefix.length)
        .trim()
        .split(/\s/g);
    const command = bot.getCommands().get(commandName);
    if (!command)
        return;
    const meetsRequirements = yield command.meetsRequirements(message);
    if (!meetsRequirements)
        return;
    command.run(bot, message, args);
});
//# sourceMappingURL=message.js.map