import * as env from "dotenv";
env.config({ path: "../.env" });

import Bot from "./bot";

const leekbot = new Bot({ prefix: ";" });
leekbot.loadComponents("./components");
leekbot.init("./commands", "./events", process.env.TOKEN || "undefined");