"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config({ path: "../.env" });
require("./database/connection");
const LeekbotClient_1 = __importDefault(require("./LeekbotClient"));
const leekbot = new LeekbotClient_1.default({ prefix: ";" });
leekbot.loadComponents("components", /^component\.js$/);
leekbot.init("commands", "events", process.env.TOKEN || "undefined");
//# sourceMappingURL=index.js.map