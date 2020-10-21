import ConditionBitField from "./ConditionBitField";
import { database } from "../../util/database"

const getBitField = async (guild: string, channel: string): Promise<ConditionBitField> => {
    const snapshot = await database.get("conditions", guild);

    const bits = snapshot.data()?.[channel] || 0;
    const bitfield = new ConditionBitField(bits);

    return bitfield;
}

export const getChannelConditions = async (guild: string, channel: string): Promise<Array<string> | undefined> => {
    const snapshot = await database.get("conditions", guild);

    const bits: number = snapshot.data()?.[channel];

    const bitfield = new ConditionBitField(bits);
    const serializedField = bitfield.serialize();

    return Object.keys(serializedField).filter(key => serializedField[key]);

}

export const addCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    const bits = await getBitField(guild, channel);
    bits.add(ConditionBitField.FLAGS[condition.toLowerCase()]);

    await database.set("conditions", guild, { [channel]: bits })
}

export const removeCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    if (!ConditionBitField.FLAGS[condition.toLowerCase()]) return;

    const bits = await getBitField(guild, channel)
    bits.remove(ConditionBitField.FLAGS[condition.toLowerCase()])

    if (bits.bitfield !== 0)
        await database.set("conditions", guild, { [channel]: bits })
    else
        await database.remove("conditions", guild, channel)
}