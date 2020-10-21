import { Message, MessageReaction, User, Permissions, RoleResolvable } from 'discord.js';
import Bot from '../../LeekbotClient';
import { database } from "../../util/database"


const Conditions = new Map();

Conditions.set("messageReactionAdd", {
    async verify(reaction: MessageReaction, user: User) {
        try {
            const verifySnapshot = await firebase.readDatabaseAt(`${reaction.message.guild?.id}/verify`);
            const verifySettings = verifySnapshot.val();
            const roles = verifySettings.roleIDs;
            const memberThatReacted = await reaction.message.guild?.members.fetch(user.id);

            if (!memberThatReacted) return;

            if (memberThatReacted.hasPermission(Permissions.FLAGS.MANAGE_ROLES)) {
                const userToVerify = await reaction.message.guild?.members.fetch(reaction.message.author.id);
                if (userToVerify) {
                    await userToVerify.setNickname(reaction.message.content);
                    await userToVerify.roles.add(roles);
                }
                reaction.message.reactions.removeAll();
            }
        } catch (e) { console.log(e); }
    },
    async verifier(reaction: MessageReaction, user: User) {
        try {
            const embed = reaction.message.embeds[0];
            if (!embed) return;

            const rolesSnapshot = await firebase.readDatabaseAt(`${reaction.message.guild?.id}/verify/roleIDs`);
            const roleIDs = rolesSnapshot.val();

            for (const field of embed.fields) {
                const memberID = field.value.match(/\d+/g);
                if (!memberID) continue;

                const guildMember = await reaction.message.guild?.members.fetch(memberID[0]);
                if (!guildMember) continue;
                await guildMember.roles.add(roleIDs, `User verified by ${user.tag}.`);
                await guildMember.setNickname(field.name, `User verified by ${user.tag}.`);
            }

            await firebase.ref(`${reaction.message.guild?.id}/verify/batch`).remove();
            await reaction.message.reactions.removeAll();

            reaction.message.channel.send(`Successfully verified ${embed.fields.length} users.`);
        } catch (e) { console.log(e); }
    },
    async bulletin(bot: Bot, reaction: MessageReaction, user: User) {
        try {
            if (reaction.message.author.id === bot.user?.id && reaction.message.embeds.length > 0) {

                const embed = reaction.message.embeds[0];
                const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                if (!field) return;

                const member = await reaction.message.guild?.members.fetch(user.id);
                const role = reaction.message.guild?.roles.cache.find(role => role.name === field.name);

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
    },
    verify() { return; }
})

Conditions.set("message", {
    async verify(message: Message) {
        try {
            const verifySnapshot = await firebase.readDatabaseAt(`${message.guild?.id}/verify`);
            const verifySettings = verifySnapshot.val();

            if (!verifySettings.verifierChannel) {
                if (message.content.match(verifySettings.regex))
                    await message.react(verifySettings.emoji);
            } else {
                await firebase.ref(`${message.guild?.id}/verify/batch/${message.author.id}`).set(message.content);
            }


        } catch (e) { console.log(e); }
    },
    verifier() { return; },
    async locked(message: Message) {
        try {
            const snapshot = await firebase.readDatabaseAt(`${message.guild?.id}/image/locked`);
            const lockedChannels = snapshot.val();

            //checks if any message posted in a read-only channel has an attachment
            //if it doesn't, deletes it
            if (lockedChannels.includes(message.channel.id) &&
                !(message.attachments.size > 0) &&
                (message.content.length > 0 && /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/.test(message.content))) {
                message.delete();
            }
        } catch (e) { console.log(e); }
    }
})

export default Conditions;