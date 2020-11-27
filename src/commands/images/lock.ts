import { Message, Permissions } from "discord.js";
import Bot from "../../client/LeekbotClient";

export default {
    async run(bot: Bot, message: Message) {
        const channelIDs = message.mentions.channels.map(channel => channel.id);
        const conditionDB = bot.getComponent("ConditionHandler").database;
        
        for (const channelID of channelIDs) {
            await conditionDB.addCondition(message.guild?.id, channelID, "locked");
        }

        message.channel.send(`${message.mentions.channels} is/are image locked.`)
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