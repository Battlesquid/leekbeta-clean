import type { Message } from "discord.js";
import type Bot from "./LeekbotClient";

export interface BotSettings {
    prefix: string
}

export interface RequireDirectoryOptions {
    recursive?: boolean
    filter?: RegExp | string
    default?: boolean
}

export interface RequireDirectoryModules {
    [key: string]: any
}

export interface Command {
    run(bot: Bot, message: Message, args: string[]): Promise<void>
    meetsRequirements(message: Message): Promise<boolean>
}

export interface Command {
    run(message: Message, args: string[]): Promise<void>
    meetsRequirements(message: Message): Promise<boolean>
}

export interface Command {
    run(message: Message): Promise<void>
    meetsRequirements(message: Message): Promise<boolean>
}