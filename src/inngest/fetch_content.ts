import { selectProject } from "../db/project.js";
import { logger } from "../logger/index.js";
import { inngest } from "./inngest.js";
import { extractHTMLText, stripHTMLAttributes } from "../html/index.js";
import { extractError } from "../utils.js";
import { upsertProjectContent } from "../db/project_content.js";
import fetch from "node-fetch";

export const fetchPageContent = inngest.createFunction({
  name: "Fetch page content",
  retries: 20
}, {
  event: "app/faqs.fetch_page"
}, async ({ event, step }) => {
  let log = logger.child({
    event: event.name,
    eventData: event.data,
    eventID: event.data.id
  })

  const project = await step.run("Get project info", async () => {
    log.debug("getting project info")
    try {
      return await selectProject(event.data.projectID)
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error selecting project")
      throw error
    }
  })
  if (!project) {
    logger.warn("did not find project, aborting workflow")
    return
  }

  await step.run("Fetch and clean HTML", async () => {
    log.debug("fetching and cleaning HTML")
    try {
      // Fetch content
      const res = await fetch(new URL(`https://${project.domain}${event.data.path}`))
      let content = await res.text()

      // Clean content
      if (project.selector) {
        // We have HTML, let's use that
        const htmlContent = stripHTMLAttributes(content, project.selector)
        if (!htmlContent) {
          log.error("got no html content, aborting")
          return
        }
        content = htmlContent
      } else {
        // Just use the body text
        log.debug("no selector, using plain text")
        content = extractHTMLText(content)
      }

      await upsertProjectContent({
        content,
        format: project.selector ? "html" : "text",
        id: event.data.path,
        project_id: event.data.projectID,
        user_id: project.user_id
      })
      log.debug("inserted project content")
    } catch (error) {
      log.error({
        err: extractError(error)
      }, "error fetching and cleaning HTML")
      throw error
    }
  })

  // Trigger faq generation event
  await step.sendEvent({
    name: "app/faqs.generate",
    data: {
      id: event.data.id + "_sub_generate",
      path: event.data.path,
      projectID: event.data.projectID,
    }
  })
})
