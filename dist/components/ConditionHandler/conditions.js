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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const database_1 = __importDefault(require("../../util/database"));
const Conditions = new Map();
const database = database_1.default.database;
Conditions.set("messageReactionAdd", {
    verify(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message: { guild, reactions } } = reaction;
                if (!guild)
                    return;
                const memberThatReacted = yield guild.members.fetch(user.id);
                if (!memberThatReacted)
                    return;
                const snapshot = yield database_1.default.get("settings", guild.id);
                const settings = snapshot.data();
                if (!settings)
                    return;
                const roles = settings.roles;
                if (memberThatReacted.hasPermission(discord_js_1.Permissions.FLAGS.MANAGE_ROLES)) {
                    const userToVerify = yield guild.members.fetch(user.id);
                    if (userToVerify) {
                        yield userToVerify.setNickname(reaction.message.content.slice(0, 32));
                        yield userToVerify.roles.add(roles);
                    }
                    reactions.removeAll();
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    verifier(reaction, user) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message: { guild, reactions } } = reaction;
                if (!guild)
                    return;
                const embed = reaction.message.embeds[0];
                if (!embed)
                    return;
                const snapshot = yield database_1.default.get("settings", guild.id);
                const settings = snapshot.data();
                if (!settings)
                    return;
                const roles = settings.roles;
                for (const field of embed.fields) {
                    const memberID = field.value.match(/\d+/g);
                    if (!memberID)
                        continue;
                    const guildMember = yield guild.members.fetch(memberID[0]);
                    if (!guildMember)
                        continue;
                    yield guildMember.roles.add(roles, `User verified by ${user.tag}.`);
                    yield guildMember.setNickname(field.name, `User verified by ${user.tag}.`);
                }
                // await firebase.ref(`${guild.id}/verify/batch`).remove();
                yield reactions.removeAll();
                reaction.message.channel.send(`Verified ${embed.fields.length} users.`);
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    bulletin(bot, reaction, user) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { message: { guild, reactions, author } } = reaction;
                if (!guild)
                    return;
                if (author.id === ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id) && reaction.message.embeds.length > 0) {
                    const embed = reaction.message.embeds[0];
                    const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                    if (!field)
                        return;
                    const member = yield guild.members.fetch(user.id);
                    const role = guild.roles.cache.find(role => role.name === field.name);
                    if (member && role)
                        member.roles.add(role);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
});
Conditions.set("messageReactionRemove", {
    bulletin(bot, reaction, user) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (reaction.message.author.id === ((_a = bot.user) === null || _a === void 0 ? void 0 : _a.id) && reaction.message.embeds.length > 0) {
                    const embed = reaction.message.embeds[0];
                    const field = embed.fields.find(field => field.value === reaction.emoji.toString());
                    if (!field)
                        return;
                    const member = yield ((_b = reaction.message.guild) === null || _b === void 0 ? void 0 : _b.members.fetch(user.id));
                    const role = (_c = reaction.message.guild) === null || _c === void 0 ? void 0 : _c.roles.cache.find(role => role.name === field.name);
                    if (member && role)
                        member.roles.remove(role);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    }
});
Conditions.set("message", {
    verify(message) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!message.guild)
                return;
            try {
                const verifySnapshot = yield firebase.readDatabaseAt(`${message.guild.id}/verify`);
                const verifySettings = verifySnapshot.val();
                if (!verifySettings.verifierChannel) {
                    if (message.content.match(verifySettings.regex))
                        yield message.react(verifySettings.emoji);
                }
                else {
                    yield firebase.ref(`${message.guild.id}/verify/batch/${message.author.id}`).set(message.content);
                }
            }
            catch (e) {
                console.log(e);
            }
        });
    },
    locked(message) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const snapshot = yield firebase.readDatabaseAt(`${(_a = message.guild) === null || _a === void 0 ? void 0 : _a.id}/image/locked`);
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
});
exports.default = Conditions;
// indexable, feature that can capture and index messages
