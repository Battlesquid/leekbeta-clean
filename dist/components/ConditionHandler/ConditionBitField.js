"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class ConditionBitField extends discord_js_1.BitField {
    constructor(bits) {
        super(bits);
    }
}
exports.default = ConditionBitField;
ConditionBitField.FLAGS = {
    VERIFY: 1 << 1,
    VERIFIER: 1 << 2,
    BULLETIN: 1 << 3,
    LOCKED: 1 << 4
};
