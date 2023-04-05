import { logger } from "../logger/index.js";
import { inngest } from "./inngest.js";

export const fetchPageContent = inngest.createFunction({
  name: "Fetch page content",
  retries: 20
}, {
  event: "app/faqs.fetch_page"
}, async ({ event, step }) => {
  let log = logger.child({
    event: event.name,
    namespace: event.data.namespace,
    eventData: event.data
  })

  // TODO: Look up URL from namespace and project

  // TODO: Fetch page content and clean HTML, store in DB for path

  // TODO: Trigger faq generation event

})
