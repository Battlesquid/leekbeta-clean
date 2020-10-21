import * as admin from "firebase-admin";
admin.initializeApp({
    credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});

export const database = {
    async get(collection: string, doc: string) {
        const snapshot = await admin.firestore().collection(collection).doc(doc).get();
        return snapshot;
    },
    async set(collection: string, doc: string, value: any) {
        return await admin.firestore().collection(collection).doc(doc).set(value);
    },
    async remove(collectionName: string, docName: string, field?: string) {
        const doc = admin.firestore().collection(collectionName).doc(docName);

        if (field)
            return await doc.update({ field: admin.firestore.FieldValue.delete() })
        else
            return await doc.delete();
    }
}