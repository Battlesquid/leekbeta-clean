import { Message } from "discord.js";
import Bot from "./LeekbotClient";

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