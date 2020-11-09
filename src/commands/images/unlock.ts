import { Message, Permissions } from "discord.js";
import Bot from "../../LeekbotClient";

export default {
    async run(bot: Bot, message: Message, args: Array<string>) {
        const channelIDs = message.mentions.channels.map(channel => channel.id);
        const conditionDB = bot.getComponent("ConditionHandler").database;
        for (const channelID of channelIDs) {
            await conditionDB.removeCondition(message.guild?.id, channelID, "locked");
        }
        message.channel.send(`${message.mentions.channels} is/are unlocked.`)
    },
    async meetsRequirements(message: Message): Promise<boolean> {
        const requirements = [
            message.member?.hasPermission(this.permission),
            message.mentions.channels.size > 0
        ];
        return requirements.every(Boolean);
    },
    usage: "...<#channels>",
    permission: Permissions.FLAGS.MANAGE_CHANNELS
}