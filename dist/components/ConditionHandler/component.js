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
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const database = __importStar(require("./ConditionDatabase"));
const conditions_1 = __importDefault(require("./conditions"));
class ConditionHandler {
    constructor(dir) {
        this.name = "ConditionHandler";
        this.conditions = new Map();
        this.database = database;
        const resolvedDir = path_1.default.resolve(__dirname, dir);
        const contents = fs_1.default.readdirSync(resolvedDir);
        const validConditions = contents.filter(file => file.endsWith(".js"))
            .map(file => require(`${resolvedDir}/${file.split(".js")[0]}`));
        for (const condition of validConditions) {
            condition.default ?
                this.conditions.set(condition.default.name, condition.default) :
                this.conditions.set(condition.name, condition);
        }
    }
    handleConditions(event, guildID, channelID, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const validConditions = yield database.getChannelConditions(guildID, channelID);
            if (!validConditions)
                return;
            for (const condition of validConditions) {
                const action = conditions_1.default.get(event)[condition.toLowerCase()];
                if (!action)
                    continue;
                action(params);
            }
        });
    }
}
exports.default = new ConditionHandler("conditions");
