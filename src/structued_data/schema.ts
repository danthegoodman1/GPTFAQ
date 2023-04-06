import { FAQPage } from "schema-dts";
import { FAQJSON } from "../openai/index.js";

export function faqJSONToSchema(faqJSON: FAQJSON[]): FAQPage {
  return {
    "@type": "FAQPage",
    "mainEntity": faqJSON.map((faq) => {
      return {
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          text: faq.answer
        }
      }
    })
  }
}
