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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ConditionDatabase = void 0;
// separate database logic from the condition logic,
// that way in case I transition to a different database,
// it'll be easier to do so in just this file
var discord_js_1 = require("discord.js");
var flags_1 = __importDefault(require("./static/flags"));
var admin = __importStar(require("firebase-admin"));
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});
var database = admin.firestore();
var ConditionDatabase = /** @class */ (function () {
    function ConditionDatabase() {
    }
    ConditionDatabase.prototype.getChannelConditions = function (guild, channel) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var doc, snapshot, bits, bitfield;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, database
                            .collection("conditions")
                            .doc(guild)];
                    case 1:
                        doc = _b.sent();
                        return [4 /*yield*/, doc.get()];
                    case 2:
                        snapshot = _b.sent();
                        bits = (_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a[channel];
                        bitfield = new discord_js_1.BitField(bits);
                        console.log(bitfield.serialize());
                        return [2 /*return*/];
                }
            });
        });
    };
    ConditionDatabase.prototype.getBitField = function (guild, channel) {
        var _a;
        return __awaiter(this, void 0, void 0, function () {
            var doc, snapshot, bits, bitfield;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        doc = database
                            .collection("conditions")
                            .doc(guild);
                        return [4 /*yield*/, doc.get()];
                    case 1:
                        snapshot = _b.sent();
                        bits = ((_a = snapshot.data()) === null || _a === void 0 ? void 0 : _a[channel]) || 0;
                        bitfield = new discord_js_1.BitField(bits);
                        return [2 /*return*/, bitfield];
                }
            });
        });
    };
    ConditionDatabase.prototype.addCondition = function (guild, channel, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var bits, doc;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getBitField(guild, channel)];
                    case 1:
                        bits = _b.sent();
                        bits.add(flags_1.default[condition]);
                        doc = database
                            .collection("conditions")
                            .doc(guild);
                        return [4 /*yield*/, doc.set((_a = {}, _a[channel] = bits, _a))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    ConditionDatabase.prototype.removeCondition = function (guild, channel, condition) {
        return __awaiter(this, void 0, void 0, function () {
            var bits, doc;
            var _a;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.getBitField(guild, channel)];
                    case 1:
                        bits = _b.sent();
                        bits.remove(flags_1.default[condition]);
                        doc = database
                            .collection("conditions")
                            .doc(guild);
                        return [4 /*yield*/, doc.set((_a = {}, _a[channel] = bits, _a))];
                    case 2:
                        _b.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return ConditionDatabase;
}());
exports.ConditionDatabase = ConditionDatabase;
