import * as dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import { v4 as uuidv4 } from 'uuid'
import cors from 'cors'
import { serve } from "inngest/express.js"

import { logger } from './logger/index.js'
import { ConnectDB } from './db/index.js'
import { extractError } from './utils.js'
import { inngest, inngestFuncs } from './inngest/index.js'

const listenPort = process.env.PORT || '8080'

declare global {
  namespace Express {
    interface Request {
      id: string
    }
  }

  namespace NodeJS {
    interface ProcessEnv {
      API_TOKEN: string
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
