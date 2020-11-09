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
const ConditionBitField_1 = __importDefault(require("./ConditionBitField"));
const models_1 = require("../../database/models");
const getBitField = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const data = yield models_1.conditions
        .findOne({ "guild": guild });
    const bits = (_a = data === null || data === void 0 ? void 0 : data.channels.find(ch => ch.id === channel)) === null || _a === void 0 ? void 0 : _a.bitfield;
    return new ConditionBitField_1.default(bits || 0);
});
const getChannelConditions = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    const bitfield = yield getBitField(guild, channel);
    const serializedField = bitfield.serialize();
    return Object.keys(serializedField).filter(key => serializedField[key]);
});
const addCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const bits = yield getBitField(guild, channel);
    bits.add(ConditionBitField_1.default.FLAGS[condition.toUpperCase()]);
    const doc = yield models_1.conditions
        .findOne({ guild: guild });
    if (doc) {
        const existingConditions = doc.channels.find(ch => ch.id === channel);
        if (existingConditions) {
            const index = doc.channels.indexOf(existingConditions);
            doc.channels[index].bitfield = bits.bitfield;
        }
        else {
            doc.channels.push({ id: channel, bitfield: bits.bitfield });
        }
        yield doc.save();
    }
    else {
        const conditions = new models_1.conditions({
            guild: guild,
            channels: [{ id: channel, bitfield: bits.bitfield }]
        });
        yield conditions.save();
    }
});
const batchAddCondition = (guild, channels, condition) => __awaiter(void 0, void 0, void 0, function* () {
});
const batchRemoveCondition = (guild, channels, condition) => __awaiter(void 0, void 0, void 0, function* () {
});
const removeCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ConditionBitField_1.default.FLAGS[condition.toLowerCase()])
        return;
    const bits = yield getBitField(guild, channel);
    bits.remove(ConditionBitField_1.default.FLAGS[condition.toUpperCase()]);
});
exports.default = { getChannelConditions, addCondition, batchAddCondition, removeCondition, batchRemoveCondition };
//# sourceMappingURL=ConditionDatabase.js.map