"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.settings = exports.conditions = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const IdFieldValue = {
    type: String,
    match: /^(\d+)$/,
    maxlength: 18,
    minlength: 18
};
const conditionSchema = new mongoose_1.default.Schema({
    guild: String,
    channels: [new mongoose_1.default.Schema({
            id: IdFieldValue,
            bitfield: Number
        })]
});
const VerificationSettingsSchema = new mongoose_1.default.Schema({
    roles: [IdFieldValue],
    batch: [{
            id: Number,
            un: String
        }],
    regex: String,
    notifChannel: String
});
//maybe add a post hook to check for amount of verified users
const ImageSettingsSchema = new mongoose_1.default.Schema({
    logger: IdFieldValue
});
const RoleSettingsSchema = new mongoose_1.default.Schema({
    bulletin: IdFieldValue,
});
const settingsSchema = new mongoose_1.default.Schema({
    guild: IdFieldValue,
    verification: VerificationSettingsSchema,
    images: ImageSettingsSchema,
    roles: RoleSettingsSchema
});
// const VerificationSettings = mongoose.model("VerificationSettings", VerificationSettingsSchema);
// const ImageSettings = mongoose.model("ImageSettings", ImageSettingsSchema)
// const RoleSettings = mongoose.model("RoleSettings", RoleSettingsSchema)
exports.conditions = mongoose_1.default.model("conditions", conditionSchema);
exports.settings = mongoose_1.default.model("settings", settingsSchema);
// const conditions = new models.conditions({
//     guild: "000000000000000000",
//     channels: [
//         {
//             id: "111111111111111111",
//             bitfield: 16
//         },
//         {
//             id: "222222222222222222",
//             bitfield: 16
//         }
//     ]
// })
// conditions.save((err, data) => {
//     console.log(data)
// })
// (async () => {
//     const data = await conditions
//         .findOne({ "channels.id": "222222222222222222" }, "channels.$")
//     if (!data) return;
//     const [channel] = data.channels;
//     console.log(channel);
// })()
// const s = new models.settings({
//     guild: "333333333333333333",
//     verification: {
//         roles: ["111111111111111111", "222222222222222222"],
//         batch: [{
//             id: "222333444555666777",
//             un: "Mayowa | 2612A"
//         }],
//         regex: "/.+/"
//     },
//     images: {
//         logger: "888888888888888888"
//     }
// })
// models.settings
//     .findOne({ guild: "333333333333333333" }, "verification.batch verification.roles", (err, data) => {
//         if (err) console.log(err);
//         if (!data) return; 
//         console.log(data)
//     })
//# sourceMappingURL=models.js.map