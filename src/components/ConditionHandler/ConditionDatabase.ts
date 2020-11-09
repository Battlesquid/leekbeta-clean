import ConditionBitField from "./ConditionBitField";
import { conditions as ConditionModel } from "../../database/models"

const getBitField = async (guild: string, channel: string): Promise<ConditionBitField> => {
    const data = await ConditionModel
        .findOne({ "guild": guild })
    const bits = data?.channels.find(ch => ch.id === channel)?.bitfield;

    return new ConditionBitField(bits || 0)
}

const getChannelConditions = async (guild: string, channel: string): Promise<Array<string> | undefined> => {
    const bitfield = await getBitField(guild, channel);
    const serializedField = bitfield.serialize();

    return Object.keys(serializedField).filter(key => serializedField[key]);
}

const addCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    const bits = await getBitField(guild, channel);
    bits.add(ConditionBitField.FLAGS[condition.toUpperCase()]);

    const doc = await ConditionModel
        .findOne({ guild: guild })

    if (doc) {
        const existingConditions = doc.channels.find(ch => ch.id === channel);
        if (existingConditions) {

            const index = doc.channels.indexOf(existingConditions);
            doc.channels[index].bitfield = bits.bitfield;

        } else {
            doc.channels.push({ id: channel, bitfield: bits.bitfield })
        }

        await doc.save();

    } else {
        const conditions = new ConditionModel({
            guild: guild,
            channels: [{ id: channel, bitfield: bits.bitfield }]
        })
        await conditions.save();
    }
}

const batchAddCondition = async (guild: string, channels: Array<string>, condition: string): Promise<void> => {

}

const batchRemoveCondition = async (guild: string, channels: Array<string>, condition: string): Promise<void> => {

}

const removeCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    if (!ConditionBitField.FLAGS[condition.toLowerCase()]) return;

    const bits = await getBitField(guild, channel)
    bits.remove(ConditionBitField.FLAGS[condition.toUpperCase()])
    

}

export default { getChannelConditions, addCondition, batchAddCondition, removeCondition, batchRemoveCondition }