"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const localuri = "mongodb://127.0.0.1:27017/?compressors=zlib&gssapiServiceName=mongodb";
mongoose_1.default.connect(localuri, { useNewUrlParser: true, useUnifiedTopology: true });
// console.log(process.env.DB_PASSWORD)
const IdFieldValue = {
    type: String,
    match: /^(\d+)$/,
    maxlength: 18,
    minlength: 18
};
const conditionSchema = new mongoose_1.default.Schema({
    guild: String,
    channels: [{
            id: IdFieldValue,
            bitfield: Number
        }]
});
// const VerificationSettingsSchema = new mongoose.Schema({
//     roles: [IdFieldValue],
//     batch: [{
//         id: Number,
//         un: String
//     }],  
//     regex: String,
//     notifChannel: String
// })
// //maybe add a post hook to check for amount of verified users
// const ImageSettingsSchema = new mongoose.Schema({
//     logger: IdFieldValue
// })
// const RoleSettingsSchema = new mongoose.Schema({
//     bulletin: IdFieldValue,
// })
// const VerificationSettings = mongoose.model("VerificationSettings", VerificationSettingsSchema);
// const ImageSettings = mongoose.model("ImageSettings", ImageSettingsSchema)
// const RoleSettings = mongoose.model("RoleSettings", RoleSettingsSchema)
// export default {
//     database: firestore,
//     doc(collection: string, doc: string) {
//         return firestore.collection(collection).doc(doc);
//     },
//     async get(collection: string, doc: string) {
//         const snapshot = await firestore.collection(collection).doc(doc).get();
//         return snapshot;
//     },
//     async set(collection: string, doc: string, value: any) {
//         return await firestore.collection(collection).doc(doc).set(value);
//     },
//     async remove(collectionName: string, docName: string, field?: string) {
//         const doc = firestore.collection(collectionName).doc(docName);
//         if (field)
//             return await doc.update({ field: admin.firestore.FieldValue.delete() })
//         else
//             return await doc.delete();
//     }
// }
//# sourceMappingURL=database.js.map