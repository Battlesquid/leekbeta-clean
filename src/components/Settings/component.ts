import { Component } from "../types";

class GuildSettings implements Component {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export default GuildSettings;