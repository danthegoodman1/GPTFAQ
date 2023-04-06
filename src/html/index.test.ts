import { test } from "vitest"
import fetch from "node-fetch"

import { extractHTMLText, stripHTMLAttributes } from "./index.js"

const testPage = "https://www.tangia.co/post/optimizing-your-tweets-to-maximize-the-algorithm"

test("clean html with selector", async () => {
  const res = await fetch(testPage)
  const htmlContent = await res.text()
  console.log("got html:", htmlContent.slice(0, 500))
  const strippedHTML = stripHTMLAttributes(htmlContent, ".notion-page")
  console.log(strippedHTML.slice(0, 1000))
})

test("get text content from page", async () => {
  const res = await fetch(testPage)
  const htmlContent = await res.text()
  console.log("got html:", htmlContent.slice(0, 500))
  const extractedText = extractHTMLText(htmlContent)
  console.log("extracted text:", extractedText.slice(0, 2000))
})
