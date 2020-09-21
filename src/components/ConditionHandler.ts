import fs from "fs";
import { Component, Condition } from "../interfaces";

export const component: Component = {
    name: "ConditionHandler",
    init(path: string): any {
        const contents = fs.readdirSync(path);
        const validConditions = [
            ...contents.filter(file => file.endsWith(".js"))
                .map(file => require(`${path}/${file.split(".js")[0]}`).default)
        ];
        return {
            
        };
    }
} 