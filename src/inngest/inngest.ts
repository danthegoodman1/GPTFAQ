import { Inngest } from "inngest";

import { InngestEvents } from "./events.js";

export const inngest = new Inngest<InngestEvents>({ name: "FAQGeneration" })
