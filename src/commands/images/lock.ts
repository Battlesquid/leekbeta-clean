import { Message, Permissions } from "discord.js";
import Bot from "../../LeekbotClient";

export default {
    async run(bot: Bot, message: Message, args: Array<string>) {
        const channelIDs = message.mentions.channels.map(channel => channel.id);
        if (!channelIDs) return;

        const conditionDB = bot.getComponent("ConditionHandler").database;
        conditionDB.batchAddCondition(message.guild?.id, channelIDs, "locked")
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