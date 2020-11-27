import type { Component } from "../types";
import type { SettingTypes } from "../../database/types"
import { settings } from "../../database/models"

class Settings implements Component {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    async addOrUpdateSetting(type: SettingTypes, guild: string, newSettings: { [key: string]: any }) {
        const requestedSettings = await settings.findOne({ guild: guild });

        if (requestedSettings) {
            const subType = 
            console.log("found settings");
        } else {
            const requestedSettings = new settings({
                guild: guild,
                [type]: newSettings
            })
            await requestedSettings.save();
        }
    }

}

export default new Settings("Settings");