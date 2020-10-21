import { BitField } from "discord.js";

export default class ConditionBitField extends BitField<string> {
    constructor(bits: number) {
        super(bits);
    }
    static FLAGS: { [prop: string]: number } = {
        VERIFY: 1 << 1,
        VERIFIER: 1 << 2,
        BULLETIN: 1 << 3,
        LOCKED: 1 << 4
    }
}
