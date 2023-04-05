import KSUID from "ksuid"
import { v4 as uuid } from "uuid"

export async function ksuidWithPrefix(prefix: string) {
  const id = await KSUID.random()
  return `${prefix}${id.string}`
}

export async function uuidWithPrefix(prefix: string) {
  return `${prefix}${uuid()}`
}

export function extractError(e: any | Error) {
  return Object.fromEntries(
    Object.getOwnPropertyNames(e).map((key) => [key, e[key]])
  )
}

export function safeStringify(obj: any, indent = 2) {
  let cache: any[] = [];
  const retVal = JSON.stringify(obj, (key, value) =>
    typeof value === "object" && value !== null
      ? cache.includes(value)
        ? undefined // Exclude circular references
        : cache.push(value) && value
      : value,
    indent
  );
  return retVal;
}
