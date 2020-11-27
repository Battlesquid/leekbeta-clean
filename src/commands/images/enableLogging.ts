import type { Message } from "discord.js";
import type Bot from "../../client/LeekbotClient";
import { Permissions } from "discord.js";

export default {
    async run(bot: Bot, message: Message) {
        const requestedChannel = message.mentions.channels.first();
        if (!requestedChannel) return;

        bot.getComponent("Settings")
            .addOrUpdateSetting("images", message.guild?.id, {
                logger: requestedChannel.id
            })

    },
    async meetsRequirements(message: Message): Promise<boolean> {
        const requirements = [
            message.member?.hasPermission(this.permission),
            message.mentions.channels.size > 0
        ];
        return requirements.every(Boolean);
    },
    usage: "...<#channels>",
    permission: Permissions.FLAGS.MANAGE_GUILD
}