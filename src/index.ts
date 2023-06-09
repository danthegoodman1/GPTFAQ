import * as dotenv from 'dotenv'
dotenv.config()

import express, { Request } from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import path from 'path'
import { fileURLToPath } from 'url'

import { serve } from "inngest/express.js"
import { logger } from './logger/index.js'
import { ConnectDB } from './db/index.js'
import { extractError } from './utils.js'
import { inngestFuncs } from './inngest/index.js'
import { inngest } from './inngest/inngest.js'
import { selectGeneratedFAQ, upsertGeneratedFAQ } from './db/generated_faqs.js'
import { selectProject } from './db/project.js'
import { upsertProjectContent } from './db/project_content.js'

const listenPort = process.env.PORT || '8080'
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      OPENAI_TOKEN: string
    }
  }
}

async function main() {

  const app = express()
  app.use(express.json())
  app.disable('x-powered-by')
  app.use(cors())

  // Connect DB
  try {
    await ConnectDB()
  } catch (error: any) {
    logger.error({ err: extractError(error) }, "failed to connect to db")
    process.exit(1)
  }

  app.use((req, res, next) => {
    const reqID = uuidv4()
    req.id = reqID
    next()
  })

  app.use("/inngest", express.json(), serve(inngest, inngestFuncs))

  if (process.env.HTTP_LOG === "1") {
    logger.debug("using HTTP logger")
    app.use((req: any, res, next) => {
      req.log.info({ req })
      res.on("finish", () => req.log.info({ res }))
      next()
    })
  }

  app.get('/hc', (req, res) => {
    res.sendStatus(200)
  })

  app.post("/faqs/:projectID",  async (req: Request<{projectID: string}, {}, { path: string, content?: string, contentType?: "text" | "html" | "markdown" }, {}>, res) => {
    try {
      const projectID = req.params.projectID
      logger.debug("got a poke, regenerating")
      if (req.body.content && req.body.contentType) {
        logger.debug(`got provided content of type: '${req.body.contentType}'`)
        // Write it
        const project = await selectProject(projectID)
        if (!project) {
          throw new Error(`project not found: ${projectID}`)
        }
        // Simple auth
        if (req.headers.authorization !== project.poke_token) {
          return res.status(401).send("invalid poke token")
        }
        await upsertProjectContent({
          content: req.body.content,
          format: req.body.contentType,
          id: req.body.path,
          project_id: projectID,
          user_id: project.user_id
        })
        await inngest.send("app/faqs.generate", {
          data: {
            id: `${projectID}_${req.body.path}_req_${req.id}`,
            path: req.body.path,
            projectID
          }
        })
      } else {
        // Otherwise we did not find it, request generation
        await inngest.send("app/faqs.fetch_page", {
          data: {
            id: `${projectID}_${req.body.path}_inital`, // dedupe
            path: req.body.path,
            projectID
          }
        })
      }

      return res.sendStatus(201)
    } catch (error) {
      logger.error({
        err: extractError(error)
      }, "error handling request")
      return res.status(500).send(`Internal error! Our team has been notified and are working on a fix. Req ID: ${req.id}`)
    }
  })

  app.get("/faqs/:projectID", async (req: Request<{projectID: string}, {}, {}, {path: string}>, res) => {
    try {
      const projectID = req.params.projectID
      const path = req.query.path
      logger.debug("checking if we have existing generated faqs")
      const faq = await selectGeneratedFAQ(projectID, path)
      if (faq) {
        logger.debug("found an existing faq, sending it")
        res.setHeader("content-type", "application/ld+json")
        res.send(faq.content)
        if (faq.expires && faq.expires.getTime() < new Date().getTime()) {
          logger.debug("found faq was expired, refreshing in background")
          await inngest.send("app/faqs.fetch_page", {
            data: {
              id: `${projectID}_${path}_${faq.expires.getTime().toString()}`, // dedupe for this refresh
              path,
              projectID
            }
          })
        }
        return
      }

      // Otherwise we did not find it, request generation
      await inngest.send("app/faqs.fetch_page", {
        data: {
          id: `${projectID}_${path}_inital`, // dedupe
          path,
          projectID
        }
      })
      return res.sendStatus(204)

    } catch (error) {
      logger.error({
        err: extractError(error)
      }, "error handling request")
      return res.status(500).send(`Internal error! Our team has been notified and are working on a fix. Req ID: ${req.id}`)
    }
  })

  const server = app.listen(listenPort, () => {
    logger.info(`API listening on port ${listenPort}`)
  })

  let stopping = false

  process.on('SIGTERM', async () => {
    if (!stopping) {
      stopping = true
      logger.warn('Received SIGTERM command, shutting down...')
      server.close()
      logger.info('exiting...')
      process.exit(0)
    }
  })

  process.on('SIGINT', async () => {
    if (!stopping) {
      stopping = true
      logger.warn('Received SIGINT command, shutting down...')
      server.close()
      logger.info('exiting...')
      process.exit(0)
    }
  })
}

main()
