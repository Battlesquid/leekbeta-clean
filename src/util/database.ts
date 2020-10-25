import admin from "firebase-admin";
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});
const firestore = admin.firestore();

export default {
    database: firestore,
    doc(collection: string, doc: string) {
        return firestore.collection(collection).doc(doc);
    },
    async get(collection: string, doc: string) {
        const snapshot = await firestore.collection(collection).doc(doc).get();
        return snapshot;
    },
    async set(collection: string, doc: string, value: any) {
        return await firestore.collection(collection).doc(doc).set(value);
    },
    async remove(collectionName: string, docName: string, field?: string) {
        const doc = firestore.collection(collectionName).doc(docName);

        if (field)
            return await doc.update({ field: admin.firestore.FieldValue.delete() })
        else
            return await doc.delete();
    }
}