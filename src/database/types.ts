import mongoose from "mongoose";

interface SettingsDoc extends mongoose.Document {
    guild?: string,
    verification?: mongoose.Schema<{
        roles: Array<string>,
        batch: Array<{ id: string, un: string }>,
        regex: string,
        reminderChannel: string
    }>,
    images?: mongoose.Schema<{ logger: string }>,
    roles?: mongoose.Schema<{ bulletin: string }>
}

type SettingTypes = "verification" | "images" | "roles";

type Settings<T> = {
    [key in SettingTypes]: T

}
interface ConditionsDoc extends mongoose.Document {
    guild: string,
    channels: Array<{ id: string, bitfield: number }>
}

export type { SettingsDoc, ConditionsDoc, SettingTypes }