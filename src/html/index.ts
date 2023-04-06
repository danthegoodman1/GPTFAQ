import { load } from "cheerio"

export const stripHTMLAttributes = (html: string, selector: string) => {
  const $ = load(html)
  const elem = $(selector)
  elem.children().each(function () {
    // read only hack
    (this.attributes as any) = {}
  })
  const finalContent = elem.html()
  if (!finalContent) {
    throw new Error("got not final content!")
  }
  return finalContent
}

export const extractHTMLText = (html: string): string => {
  const $ = load(html)
  return $("body").text().slice(0, 7500*2.75) // keep in generous token limit
}
