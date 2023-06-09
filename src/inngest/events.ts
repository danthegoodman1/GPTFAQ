export type InngestEvents = {
  "app/faqs.generate": GenerateFAQs
  "app/faqs.fetch_page": FetchPage
}

export interface GenerateFAQs {
  name: "app/faqs.generate"
  data: {
    id: string
    projectID: string
    /**
     * DEBUG ONLY
     *
     * If we have content, we should use it
     */
    content?: string
    /**
     * DEBUG ONLY
     *
     * If we have content, the content type (if we know)
     */
    contentType?: "text" | "markdown" | "html"
    /**
     * Path to lookup in the DB for the page.
     */
    path: string
  }
}

export interface FetchPage {
  name: "app/faqs.fetch_page"
  data: {
    id: string
    projectID: string
    path: string
  }
}
