import { Message } from "discord.js";

export interface Command {
    run(message: Message, args?: Array<string>): void
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
    trigger(): void
}

export interface Component {
    name: string
    init(...args: any[]): any
}