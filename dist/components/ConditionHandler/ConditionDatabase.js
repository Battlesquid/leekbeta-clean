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
exports.removeCondition = exports.batchAddCondition = exports.addCondition = exports.getChannelConditions = void 0;
const ConditionBitField_1 = __importDefault(require("./ConditionBitField"));
const database_1 = __importDefault(require("../../util/database"));
const getBitField = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const snapshot = yield database_1.default.get("conditions", guild);
    const bits = ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a[channel]) || 0;
    const bitfield = new ConditionBitField_1.default(bits);
    return bitfield;
});
exports.getChannelConditions = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const snapshot = yield database_1.default.get("conditions", guild);
    const bits = (_b = snapshot.data()) === null || _b === void 0 ? void 0 : _b[channel];
    const bitfield = new ConditionBitField_1.default(bits);
    const serializedField = bitfield.serialize();
    return Object.keys(serializedField).filter(key => serializedField[key]);
});
exports.addCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const bits = yield getBitField(guild, channel);
    bits.add(ConditionBitField_1.default.FLAGS[condition.toUpperCase()]);
    yield database_1.default.set("conditions", guild, { [channel]: bits.bitfield });
});
exports.batchAddCondition = (guild, channels, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {};
    for (const channel of channels) {
        console.log(channel);
        const bits = yield getBitField(guild, channel);
        bits.add(ConditionBitField_1.default.FLAGS[condition.toUpperCase()]);
        data[channel] = bits.bitfield;
    }
    database_1.default.set("conditions", guild, data);
});
exports.removeCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    if (!ConditionBitField_1.default.FLAGS[condition.toLowerCase()])
        return;
    const bits = yield getBitField(guild, channel);
    bits.remove(ConditionBitField_1.default.FLAGS[condition.toUpperCase()]);
    if (bits.bitfield !== 0)
        yield database_1.default.set("conditions", guild, { [channel]: bits.bitfield });
    else
        yield database_1.default.remove("conditions", guild, channel);
});
