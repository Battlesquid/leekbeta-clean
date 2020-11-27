import { Message } from "discord.js";
import Bot from "../client/LeekbotClient";

export default async (bot: Bot, message: Message) => {
    if (message.author.bot || !message.guild) return;
    await bot.getComponent("ConditionHandler").handleConditions("message", message.guild.id, message.channel.id, message);

    if (!message.content.startsWith(bot.prefix)) return;

    const [commandName, ...args] = message.content
        .slice(bot.prefix.length)
        .trim()
        .split(/\s/g);

    const command = bot.getCommands().get(commandName);
    if (!command) return;

    const meetsRequirements = await command.meetsRequirements(message);
    if (!meetsRequirements) return;

    command.run(bot, message, args);
}