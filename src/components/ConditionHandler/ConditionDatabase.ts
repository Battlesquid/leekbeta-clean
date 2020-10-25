import ConditionBitField from "./ConditionBitField";
import firestore from "../../util/database"

const getBitField = async (guild: string, channel: string): Promise<ConditionBitField> => {
    const snapshot = await firestore.get("conditions", guild);

    const bits = snapshot.data()?.[channel] || 0;
    const bitfield = new ConditionBitField(bits);

    return bitfield;
}

export const getChannelConditions = async (guild: string, channel: string): Promise<Array<string> | undefined> => {
    const snapshot = await firestore.get("conditions", guild);

    const bits: number = snapshot.data()?.[channel];

    const bitfield = new ConditionBitField(bits);
    const serializedField = bitfield.serialize();

    return Object.keys(serializedField).filter(key => serializedField[key]);
}

export const addCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    const bits = await getBitField(guild, channel);
    bits.add(ConditionBitField.FLAGS[condition.toUpperCase()]);
    await firestore.set("conditions", guild, { [channel]: bits.bitfield })
}

export const batchAddCondition = async (guild: string, channels: Array<string>, condition: string) => {
    const data: { [key: string]: number } = {};
    for (const channel of channels) {
        const bits = await getBitField(guild, channel);
        bits.add(ConditionBitField.FLAGS[condition.toUpperCase()]);
        data[channel] = bits.bitfield;
    }
    firestore.set("conditions", guild, data)
}

export const removeCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    if (!ConditionBitField.FLAGS[condition.toLowerCase()]) return;

    const bits = await getBitField(guild, channel)
    bits.remove(ConditionBitField.FLAGS[condition.toUpperCase()])

    if (bits.bitfield !== 0)
        await firestore.set("conditions", guild, { [channel]: bits.bitfield })
    else
        await firestore.remove("conditions", guild, channel)
}