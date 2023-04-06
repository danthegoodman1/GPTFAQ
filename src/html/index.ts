import { AnyNode, Cheerio, CheerioAPI, Element, load } from "cheerio"

export const stripHTMLAttributes = (html: string, selector: string): string | null => {
  let $ = load(html)
  let elem = $(selector)
  // Remove useless tags
  removeUselessTags(elem)
  elem.removeClass()
  // Recursively remove items
  elem.children().each((i, elem) => recursiveChildRemoval($, elem))
  const finalContent = elem.html()
  if (!finalContent) {
    return null
  }
  return finalContent
}

const recursiveChildRemoval = ($: CheerioAPI, elem: Element) => {
  for (const attr of Object.keys(elem.attribs)) {
    // console.log("removing", attr, $(elem).html())
    if (attr !== "href" || (attr === "href" && elem.attribs[attr].startsWith("#"))) {
      $(elem).removeAttr(attr)
    }
    if ($(elem).text() === "") {
      // remove empty tag
      $(elem).remove()
    }
  }
  $(elem).children().each((i, elem) => recursiveChildRemoval($, elem))
}

export const extractHTMLText = (html: string): string => {
  const $ = load(html)
  // Remove useless tags
  removeUselessTags($("*"))
  return $("body").text().slice(0, 7500*2.75) // keep in generous token limit
}

function removeUselessTags(node: Cheerio<AnyNode>) {
  node.find("svg").remove()
  node.find("img").remove()
  node.find("video").remove()
  node.find("audio").remove()
  node.find("style").remove()
}
