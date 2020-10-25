"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const firebase_admin_1 = __importDefault(require("firebase-admin"));
firebase_admin_1.default.initializeApp({
    credential: firebase_admin_1.default.credential.cert(JSON.parse(process.env.FIREBASE_AUTH || ""))
});
const firestore = firebase_admin_1.default.firestore();
exports.default = {
    database: firestore,
    doc(collection, doc) {
        return firestore.collection(collection).doc(doc);
    },
    get(collection, doc) {
        return __awaiter(this, void 0, void 0, function* () {
            const snapshot = yield firestore.collection(collection).doc(doc).get();
            return snapshot;
        });
    },
    set(collection, doc, value) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield firestore.collection(collection).doc(doc).set(value);
        });
    },
    remove(collectionName, docName, field) {
        return __awaiter(this, void 0, void 0, function* () {
            const doc = firestore.collection(collectionName).doc(docName);
            if (field)
                return yield doc.update({ field: firebase_admin_1.default.firestore.FieldValue.delete() });
            else
                return yield doc.delete();
        });
    }
};
