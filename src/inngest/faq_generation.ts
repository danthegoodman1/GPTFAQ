import { logger } from "../logger/index.js";
import { inngest } from "./index.js";

export const faqGeneration = inngest.createFunction({
  name: "FAQ Generation",
  retries: 20
}, {
  event: "app/faqs.generate"
}, async ({ event, step }) => {
  let log = logger.child({
    event: event.name,
    namespace: event.data.namespace,
    eventData: event.data
  })

  // TODO: Fetch content from DB for path, generate FAQ until valid JSON

  // TODO: Store generated FAQ in DB as Schema format

})
