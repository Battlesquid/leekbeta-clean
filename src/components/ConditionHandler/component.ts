import type { Component } from "../types";
import functions from "./ConditionDatabase";
import Conditions from "./conditions";

class ConditionHandler implements Component {
    public database = functions;
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }

    async handleConditions(event: string, guild: string, channelID: string, ...params: any) {
        const validConditions = await this.database.getChannelConditions(guild, channelID);
        if (!validConditions) return;

        console.log(validConditions);

        for (const condition of validConditions) {
            const action = Conditions.get(event)[condition.toLowerCase()];
            if (!action) continue;
            action(...params);
        }
    }
}

export default new ConditionHandler("ConditionHandler");