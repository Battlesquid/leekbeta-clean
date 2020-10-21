import * as env from "dotenv";
env.config({ path: "../.env" });

import Bot from "./LeekbotClient";

const leekbot = new Bot({ prefix: ";" });
leekbot.loadComponents("components", /^component\.js$/);
leekbot.init("commands", "events", process.env.TOKEN || "undefined");