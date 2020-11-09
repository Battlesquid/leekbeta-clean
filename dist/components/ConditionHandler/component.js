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
const ConditionDatabase_1 = __importDefault(require("./ConditionDatabase"));
const conditions_1 = __importDefault(require("./conditions"));
class ConditionHandler {
    constructor() {
        this.name = "ConditionHandler";
        this.database = ConditionDatabase_1.default;
    }
    handleConditions(event, guild, channelID, ...params) {
        return __awaiter(this, void 0, void 0, function* () {
            const validConditions = yield this.database.getChannelConditions(guild, channelID);
            if (!validConditions)
                return;
            console.log(validConditions);
            for (const condition of validConditions) {
                const action = conditions_1.default.get(event)[condition.toLowerCase()];
                if (!action)
                    continue;
                action(...params);
            }
        });
    }
}
exports.default = new ConditionHandler();
//# sourceMappingURL=component.js.map