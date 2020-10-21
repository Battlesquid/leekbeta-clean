"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.removeCondition = exports.addCondition = exports.getChannelConditions = void 0;
require("./ConditionBitField");
const admin = __importStar(require("firebase-admin"));
const ConditionBitField_1 = __importDefault(require("./ConditionBitField"));
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});
const database = admin.firestore();
const getBitField = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const doc = database
        .collection("conditions")
        .doc(guild);
    const snapshot = yield doc.get();
    const bits = ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a[channel]) || 0;
    const bitfield = new ConditionBitField_1.default(bits);
    return bitfield;
});
exports.getChannelConditions = (guild, channel) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const doc = yield database
        .collection("conditions")
        .doc(guild);
    const snapshot = yield doc.get();
    const bits = (_b = snapshot.data()) === null || _b === void 0 ? void 0 : _b[channel];
    const bitfield = new ConditionBitField_1.default(bits);
    const serializedField = bitfield.serialize();
    return Object.keys(serializedField).filter(key => serializedField[key]);
});
exports.addCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const bits = yield getBitField(guild, channel);
    bits.add(FLAGS[condition]);
    const doc = database
        .collection("conditions")
        .doc(guild);
    yield doc.set({ [channel]: bits });
});
exports.removeCondition = (guild, channel, condition) => __awaiter(void 0, void 0, void 0, function* () {
    const bits = yield getBitField(guild, channel);
    bits.remove(FLAGS[condition]);
    const doc = database
        .collection("conditions")
        .doc(guild);
    yield doc.set({ [channel]: bits });
});
