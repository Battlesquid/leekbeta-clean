import { Message, Permissions } from "discord.js";
import Bot from "../../LeekbotClient";

export default {
    async run(bot: Bot, message: Message) {
        const channels = message.mentions.channels.map(channel => channel.id);
        channels.forEach(channel => {
            
        })
    },
    async meetsRequirements(message: Message): Promise<boolean> {
        const conditions = [
            message.member?.hasPermission(this.permission),
            message.mentions.channels.size > 0
        ];
        return conditions.every(c => c === true);
    },
    usage: "...<#channels>",
    permission: Permissions.FLAGS.MANAGE_CHANNELS
}