import fs from "fs";
import * as database from "./ConditionDatabase";
import Conditions, * as ConditionFunctions from "./conditions";
import path from "path";

class ConditionHandler {
    readonly name: string = "ConditionHandler";
    private conditions = new Map();

    constructor(dir: string) {
        const resolvedDir = path.resolve(__dirname, dir);
        const contents = fs.readdirSync(resolvedDir);

        const validConditions =
            contents.filter(file => file.endsWith(".js"))
                .map(file => require(`${resolvedDir}/${file.split(".js")[0]}`))

        for (const condition of validConditions) {
            condition.default ?
                this.conditions.set(condition.default.name, condition.default) :
                this.conditions.set(condition.name, condition)
        }
    }

    public async handleConditions(event: string, guildID: string, channelID: string, ...params: any) {
        const validConditions = await database.getChannelConditions(guildID, channelID);
        if (!validConditions) return;

        for (const condition of validConditions) {
            Conditions.get(event)[condition](params)
        }
        console.log(validConditions);
        // this.conditions
    }
}

export default new ConditionHandler("conditions");