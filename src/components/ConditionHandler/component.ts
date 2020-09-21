import fs from "fs";
import { Condition } from "../../interfaces";
import * as database from "./ConditionDatabase";

class ConditionHandler {
    readonly name: string = "ConditionHandler";
    private conditions = new Map();

    constructor(path: string) {
        console.log(path);
        const contents = fs.readdirSync(path);
        console.log(contents);
        const validConditions: Array<Condition> = [
            ...contents.filter(file => file.endsWith(".js"))
                .map(file => require(`${path}/${file.split(".js")[0]}`))
        ];
    
        for (const condition of validConditions) {
            this.conditions.set(condition.name, condition.exec);
        }
    }

    public async handleConditions(guildID: string, channelID: string) {
        const conditions = await database.getChannelConditions(guildID, channelID);
        this.conditions
    }
}

export default new ConditionHandler("./conditions");