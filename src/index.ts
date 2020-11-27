import env from "dotenv";
env.config({ path: "../.env" });
import "./database/connection"

import LeekbotClient from "./client/LeekbotClient";

const leekbot = new LeekbotClient({ prefix: ";" });
leekbot.loadComponents("components", /^component\.js$/);
leekbot.init("commands", "events", process.env.TOKEN || "undefined");