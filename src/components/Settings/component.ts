import { Component } from "../../classes/Component";

class GuildSettings implements Component {
    readonly name: string;
    constructor(name: string) {
        this.name = name;
    }
}

export default GuildSettings;