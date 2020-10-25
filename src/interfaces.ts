import { Message } from "discord.js";
import Bot from "./LeekbotClient";

export interface Command {
    run(bot: Bot, message: Message, args?: Array<string>): void
    meetsRequirements(message: Message, additionalArgs?: object): boolean
    usage: string
    permission: number
}

export interface BotSettings {
    prefix: string
}

export interface Condition {
    name: string
    event: string
    exec(): void
}

export interface Component {
    name: string
    init(...args: any[]): any
    props: any
}

export interface RequireDirectoryOptions {
    recursive?: boolean
    filter?: RegExp | string
    default?: boolean
}

export interface RequireDirectoryModules {
    [key: string]: any
}