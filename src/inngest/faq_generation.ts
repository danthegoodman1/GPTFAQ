import { selectProject } from "../db/project.js";
import { getProjectContent } from "../db/project_content.js";
import { logger } from "../logger/index.js";
import { FAQJSON, GenerateFAQ } from "../openai/index.js";
import { extractError } from "../utils.js";
import { inngest } from "./inngest.js";
import { faqJSONToSchema } from "../structued_data/faq.js";
import { upsertGeneratedFAQ } from "../db/generated_faqs.js";
import { RowsNotFound } from "../db/errors.js";

const maxInferenceAttempts = 3
const HOURS = 1000 * 60 * 60

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
  if (!project) {
    logger.error("did not get a project, returning")
    return
  }

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
        if (!pc) {
          throw new RowsNotFound("project_content")
        }
        content = pc.content
      }

      let faqJSON: FAQJSON[] = []
      for (let i = 0; i < maxInferenceAttempts; i++) {
        log.debug({
          attempt: i
        }, "attempting generation, this will take a while")
        const faqText = await GenerateFAQ(process.env.OPENAI_TOKEN, project?.company_name, content)
        try {
          faqJSON = JSON.parse(faqText)
          break
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

      await upsertGeneratedFAQ({
        id: event.data.path,
        project_id: event.data.projectID,
        user_id: project.user_id,
        expires: process.env.EXPIRE_HOURS === "0" ? null : new Date(new Date().getTime() + HOURS * Number(process.env.EXPIRE_HOURS || 12)),
        content: JSON.stringify(finalFAQ)
      })
      log.debug("inserted generated faq")
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error transforming and storing faq")
      throw error
    }
  })

})
