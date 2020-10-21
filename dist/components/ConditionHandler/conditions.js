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
const discord_js_1 = require("discord.js");
exports.default = {
    messageReactionAdd: {
        verify({ reaction, user }) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const verifySnapshot = yield firebase.readDatabaseAt(`${(_a = reaction.message.guild) === null || _a === void 0 ? void 0 : _a.id}/verify`);
                    const verifySettings = verifySnapshot.val();
                    const roles = verifySettings.roleIDs;
                    const memberThatReacted = yield ((_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(user.id));
                    if (!memberThatReacted)
                        return;
                    if (memberThatReacted.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
                        const userToVerify = yield ((_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(reaction.message.author.id));
                        if (userToVerify) {
                            yield userToVerify.setNickname(reaction.message.content);
                            yield userToVerify.roles.add(roles);
                        }
                        reaction.message.reactions.removeAll();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        },
        verifier({ reaction, user }) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const embed = reaction.message.embeds[0];
                    if (!embed)
                        return;
                    const rolesSnapshot = yield firebase.readDatabaseAt(`${(_a = reaction.message.) === null || _a === void 0 ? void 0 : _a.id}/verify/roleIDs`);
                    const roleIDs = rolesSnapshot.val();
                    embed.fields.forEach((field) => __awaiter(this, void 0, void 0, function* () {
                        var _c;
                        try {
                            const guildMember = yield ((_c = reaction.message.) === null || _c === void 0 ? void 0 : _c.members.fetch(field.value.match(/\d+/g)[0]));
                            yield guildMember.roles.add(...roleIDs, `User verified by ${user.tag}.`);
                            yield guildMember.setNickname(field.name, `User verified by ${user.tag}.`);
                        }
                        catch (e) {
                            console.log(e);
                        }
                    }));
                    yield firebase.ref(`${(_b = reaction.message.) === null || _b === void 0 ? void 0 : _b.id}/verify/batch`).remove();
                    yield reaction.message.reactions.removeAll();
                    reaction.message.channel.send(`Successfully verified ${embed.fields.length} users.`);
                }
                catch (e) {
                    console.log(e);
                }
            });
        },
        bulletin({ bot, reaction, user }) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (reaction.message.author.id === ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id) && reaction.message.embeds.length > 0) {
                        const embed = reaction.message.embeds[0];
                        const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                        const role = (_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(role => role.name === field.name);
                        const member = yield ((_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(user.id));
                        member.roles.add(role);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
    },
    reactionRemove: {
        bulletin({ bot, reaction, user }) {
            var _a, _b, _c;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    if (reaction.message.author.id === ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id) && reaction.message.embeds.length > 0) {
                        const embed = reaction.message.embeds[0];
                        const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                        if (!field)
                            return;
                        const role = (_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.roles.cache.find(role => role.name === field.name);
                        const member = yield ((_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.members.fetch(user.id));
                        if (!(member && role))
                            return;
                        member.roles.remove(role);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        },
        verify() { return; }
    },
    message: {
        verify({ message }) {
            var _a, _b;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const verifySnapshot = yield firebase.readDatabaseAt(`${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}/verify`);
                    const verifySettings = verifySnapshot.val();
                    if (!verifySettings.verifierChannel) {
                        if (message.content.match(verifySettings.regex))
                            yield message.react(verifySettings.emoji);
                    }
                    else {
                        yield firebase.ref(`${(_b = message.guild) === null || _b === void 0 ? void 0 : _b.id}/verify/batch/${message.author.id}`).set(message.content);
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        },
        verifier() { return; },
        locked({ message }) {
            var _a;
            return __awaiter(this, void 0, void 0, function* () {
                try {
                    const snapshot = yield firebase.readDatabaseAt(`${(_a = message.) === null || _a === void 0 ? void 0 : _a.id}/image/locked`);
                    const lockedChannels = snapshot.val();
                    //checks if any message posted in a read-only channel has an attachment
                    //if it doesn't, deletes it
                    if (lockedChannels.includes(message.channel.id) &&
                        !(message.attachments.size > 0) &&
                        (message.content.length > 0 && /([--:\w?@%&+~#=]*\.[a-z]{2,4}\/{0,2})((?:[?&](?:\w+)=(?:\w+))+|[--:\w?@%&+~#=]+)?/.test(message.content))) {
                        message.delete();
                    }
                }
                catch (e) {
                    console.log(e);
                }
            });
        }
    }
};
