import fetch from "node-fetch"

import { logger } from "../logger/index.js";
import { extractError } from "../utils.js";

interface OpenAIChatMessage {
  role: "user" | "system" | "assistant"
  content: string
}

export interface ChatCompletion {
  id:      string;
  object:  string;
  created: number;
  model:   string;
  usage:   Usage;
  choices: Choice[];
}

export interface Choice {
  message:       Message;
  finish_reason: string;
  index:         number;
}

export interface Message {
  role:    string;
  content: string;
}

export interface Usage {
  prompt_tokens:     number;
  completion_tokens: number;
  total_tokens:      number;
}

export interface FAQJSON {
  question: string
  answer: string
}

function generateInitialPrompt(companyName: string): string {
  return `You are an AI FAQ generating assistant.

The content between the <webpage> tags is an article from a webpage. Generate 2 to 4 FAQs in JSON format like:
[
{
  "question": "INSERT QUESTION HERE",
  "answer": "INSERT ANSWER HERE AS HTML"
},
]

Where the answer are in html using only <p>, <b>, and <a> tags as needed, retaining links (href) within the <a> tags if relevant for the answer and found in the page content. Keep all answers concise and no more than one sentence.

Do not add any additional prose.

At least one of the answers should try to feature "${companyName}", and this should be the second FAQ if it is mentioned.`
}

export async function GenerateFAQ(authToken: string, companyName: string, sourceContent: string): Promise<string> {
  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
      method: "POST",
      body: JSON.stringify({
        model: "gpt-4",
        temperature: 1,
        max_tokens: 400,
        presence_penalty: 0.0,
        top_p: 1.0,
        messages: [
          {
            role: "system",
            content: generateInitialPrompt(companyName)
          },
          {
            role: "user",
            content: `<webpage>\n${sourceContent}\n</webpage>`
          }
        ] as OpenAIChatMessage[]
      })
    })
    const resText = await res.text()
    if (res.status >= 300) {
      throw new Error(`high status code ${res.status}: ${resText}`)
    }
    const completion = JSON.parse(resText) as ChatCompletion
    return completion.choices[0].message.content
  } catch (error) {
    logger.error({
      err: extractError(error)
    }, "error making chat completion request")
    throw error
  }
}
