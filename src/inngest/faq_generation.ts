import { selectProject } from "../db/project.js";
import { getProjectContent } from "../db/project_content.js";
import { logger } from "../logger/index.js";
import { FAQJSON, GenerateFAQ } from "../openai/index.js";
import { extractError } from "../utils.js";
import { inngest } from "./inngest.js";

const maxInferenceAttempts = 3

export const faqGeneration = inngest.createFunction({
  name: "FAQ Generation",
  retries: 20
}, {
  event: "app/faqs.generate"
}, async ({ event, step }) => {
  let log = logger.child({
    event: event.name,
    namespace: event.data.namespace,
    eventData: event.data,
    eventID: event.data.id
  })

  // TODO: Fetch content from DB for path, generate FAQ until valid JSON
  await step.run("generate faq", async () => {
    try {
      const project = await selectProject(event.data.projectID)
      const pc = await getProjectContent(event.data.projectID, event.data.path)

      let faqJSON: FAQJSON[] = []
      for (let i = 0; i < maxInferenceAttempts; i++) {
        const faqText = await GenerateFAQ(process.env.OPENAI_TOKEN, project?.company_name, pc.content)
        try {
          faqJSON = JSON.parse(faqText)
        } catch (error) {
          log.warn({
            text: faqText,
            attempt: i
          }, "failed to generate JSON")
        }
      }
      if (faqJSON.length === 0) {
        throw new Error("failed to generate JSON after max attempts!")
      }
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error generating faq")
      throw error
    }
  })

  // TODO: Store generated FAQ in DB as Schema format

})
