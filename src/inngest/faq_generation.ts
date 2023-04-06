import { selectProject } from "../db/project.js";
import { getProjectContent } from "../db/project_content.js";
import { logger } from "../logger/index.js";
import { FAQJSON, GenerateFAQ } from "../openai/index.js";
import { extractError } from "../utils.js";
import { inngest } from "./inngest.js";
import { faqJSONToSchema } from "../structued_data/schema.js";
import { insertGeneratedSchema } from "../db/generated_schema.js";

const maxInferenceAttempts = 3

export const faqGeneration = inngest.createFunction({
  name: "FAQ Generation",
  retries: 20
}, {
  event: "app/faqs.generate"
}, async ({ event, step }) => {
  let log = logger.child({
    event: event.name,
    eventData: event.data,
    eventID: event.data.id
  })

  // Get project info
  const project = await step.run("Get project info", async () => {
    return await selectProject(event.data.projectID)
  })

  // Fetch content from DB for path, generate FAQ until valid JSON
  const faqJSON = await step.run("Generate faq", async () => {
    try {
      let content: string
      if (event.data.content) {
        log.warn("using provided content, this should be for testing only!")
        content = event.data.content
      } else {
        log.debug("getting project content")
        const pc = await getProjectContent(event.data.projectID, event.data.path)
        content = pc.content
      }

      let faqJSON: FAQJSON[] = []
      for (let i = 0; i < maxInferenceAttempts; i++) {
        const faqText = await GenerateFAQ(process.env.OPENAI_TOKEN, project?.company_name, content)
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
      log.debug({
        faqJSON
      }, "generate faq json")
      return faqJSON
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error generating faq")
      throw error
    }
  })

  await step.run("Transform and store FAQ", async () => {
    try {
      const finalFAQ = faqJSONToSchema(faqJSON)
      log.debug({
        finalFAQ
      }, "generated final faq")

      await insertGeneratedSchema({
        id: event.data.path,
        project_id: event.data.projectID,
        user_id: project.user_id
      })
      log.debug("inserted generated schema")
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error transforming and storing faq")
      throw error
    }
  })

})
