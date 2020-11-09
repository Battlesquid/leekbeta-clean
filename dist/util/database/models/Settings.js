"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const settingsSchema = new mongoose_1.default.Schema({
    guild: {
        type: String,
        match: /^(\d+)$/,
        maxlength: 18,
        minlength: 18
    }
});
exports.default = mongoose_1.default.model("settings", settingsSchema);
