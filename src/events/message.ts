import { Message } from "discord.js";
import ConditionHandler from "../components/ConditionHandler"
import Bot from "../bot";

export default async (bot: Bot, message: Message) => {
    if (message.author.bot || message.guild?.id === undefined) return;
    await bot.handleConditions(message.guild?.id, message.channel.id);

    if (!message.content.startsWith(bot.getPrefix())) return;

    const [commandName, ...args] = message.content
        .slice(bot.getPrefix().length)
        .trim()
        .split(/\s/g);

    const command = bot.getCommands().get(commandName);
    if (!command) return;

    const meetsRequirements = await command.meetsRequirements(message);
    if (!meetsRequirements) return;

    command.run(message, args);
}