import { Inngest } from "inngest";

import { InngestEvents } from "./events.js";

export const inngest = new Inngest<InngestEvents>({ name: "SlackSemanticSearch" })

import { faqGeneration } from "./faq_generation.js";
import { fetchPageContent } from "./fetch_content.js";

export const inngestFuncs = [faqGeneration, fetchPageContent]
