import { BitField } from "discord.js"
import FLAGS from "../../static/flags";
import * as admin from "firebase-admin";
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});
const database = admin.firestore();

const getBitField = async (guild: string, channel: string): Promise<BitField<string>> => {
    const doc = database
        .collection("conditions")
        .doc(guild);

    const snapshot = await doc.get();

    const bits = snapshot.data()?.[channel] || 0;
    const bitfield = new BitField(bits);
    return bitfield;
}

export const getChannelConditions = async (guild: string, channel: string): Promise<void> => {
    const doc = await database
        .collection("conditions")
        .doc(guild);
    const snapshot = await doc.get();

    const bits = snapshot.data()?.[channel];
    const bitfield = new BitField(bits);
    console.log(bitfield.serialize());
}

export const addCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    const bits = await getBitField(guild, channel);
    bits.add(FLAGS[condition]);

    const doc = database
        .collection("conditions")
        .doc(guild);

    await doc.set({ [channel]: bits })
}

export const removeCondition = async (guild: string, channel: string, condition: string): Promise<void> => {
    const bits = await getBitField(guild, channel)
    bits.remove(FLAGS[condition])

    const doc = database
        .collection("conditions")
        .doc(guild)

    await doc.set({ [channel]: bits })
}