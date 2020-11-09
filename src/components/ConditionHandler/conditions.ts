import type { Message, MessageReaction, User } from 'discord.js';
import type Bot from '../../LeekbotClient';
import { Permissions } from "discord.js"

const Conditions = new Map();

Conditions.set("messageReactionAdd", {
    async verify(reaction: MessageReaction, user: User) {
        try {
            const { message: { guild, reactions } } = reaction;
            if (!guild) return;

            const memberThatReacted = await guild.members.fetch(user.id);
            if (!memberThatReacted) return;

            const snapshot = await firestore.get("settings", guild.id);
            const settings = snapshot.data();
            if (!settings) return;

            const roles = settings.roles;

            if (memberThatReacted.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
                const userToVerify = await guild.members.fetch(user.id);
                if (userToVerify) {
                    await userToVerify.setNickname(reaction.message.content.slice(0, 32));
                    await userToVerify.roles.add(roles);
                }
                reactions.removeAll();
            }
        } catch (e) { console.log(e); }
    },
    async verifier(reaction: MessageReaction, user: User) {
        try {
            const { message: { guild, reactions } } = reaction;
            if (!guild) return;

            const embed = reaction.message.embeds[0];
            if (!embed) return;

            const snapshot = await firestore.get("settings", guild.id);
            const settings = snapshot.data();
            if (!settings) return;

            const roles = settings.roles;

            for (const field of embed.fields) {
                const memberID = field.value.match(/\d+/g);
                if (!memberID) continue;

                const guildMember = await guild.members.fetch(memberID[0]);
                if (!guildMember) continue;
                await guildMember.roles.add(roles, `User verified by ${user.tag}.`);
                await guildMember.setNickname(field.name, `User verified by ${user.tag}.`);
            }

            // await firebase.ref(`${guild.id}/verify/batch`).remove();
            await reactions.removeAll();

            reaction.message.channel.send(`Verified ${embed.fields.length} users.`);
        } catch (e) { console.log(e); }
    },
    async bulletin(bot: Bot, reaction: MessageReaction, user: User) {
        try {
            const { message: { guild, reactions, author } } = reaction;
            if (!guild) return;

            if (author.id === bot.user?.id && reaction.message.embeds.length > 0) {

                const embed = reaction.message.embeds[0];
                const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                if (!field) return;

                const member = await guild.members.fetch(user.id);
                const role = guild.roles.cache.find(role => role.name === field.name);

                if (member && role)
                    member.roles.add(role);
            }
        } catch (e) { console.log(e); }
    }
})

Conditions.set("messageReactionRemove", {
    async bulletin(bot: Bot, reaction: MessageReaction, user: User) {
        try {
            if (reaction.message.author.id === bot.user?.id && reaction.message.embeds.length > 0) {
                const embed = reaction.message.embeds[0];
                const field = embed.fields.find(field => field.value === reaction.emoji.toString());

                if (!field) return;

                const member = await reaction.message.guild?.members.fetch(user.id);
                const role = reaction.message.guild?.roles.cache.find(role => role.name === field.name);

                if (member && role)
                    member.roles.remove(role);
            }
        } catch (e) { console.log(e); }
    }
})

Conditions.set("message", {
    async verify(message: Message) {
        if (!message.guild) return;

        try {
            const verifySnapshot = await firebase.readDatabaseAt(`${message.guild.id}/verify`);
            const verifySettings = verifySnapshot.val();

            if (!verifySettings.verifierChannel) {
                if (message.content.match(verifySettings.regex))
                    await message.react(verifySettings.emoji);
            } else {
                await firebase.ref(`${message.guild.id}/verify/batch/${message.author.id}`).set(message.content);
            }


        } catch (e) { console.log(e); }
    },
    async locked(message: Message) {
        try {
            const conditions = [
                !/([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/.test(message.content),
                message.content.length === 0
            ]

            if (conditions.some(Boolean) && message.attachments.size === 0) {
                message.delete();
            }
        } catch (e) { console.log(e); }
    }
})

export default Conditions;



// indexable, feature that can capture and index messages