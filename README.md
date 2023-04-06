# GPTFAQ

Generates FAQ structured data on auto-pilot for your content to increase SEO rankings. [See Google's docs on FAQPage structured data.](https://developers.google.com/search/docs/appearance/structured-data/faqpage).

FAQPage is incredible at boosting SEO rankings for informational content. GPTFAQ puts that on auto-pilot.

Run in production at [Tangia](www.tangia.co)

## How it works

Search engines will use a special `application/ld+json` format for structured data on your webpage.

GPTFAQ has 2 modes of generation:

1. On-demand
2. Poke

GPTFAQ relies on a `domain` and a `path` for each page, concatenating the `path` to the `domain` to fetch web content.

You can optionally provide a `selector` which will help GPTFAQ narrow down what it needs to focus on and allows it to use HTML (preserving `href` attributes and using where relevant) to generate the FAQs. Otherwise it will just use the `body` text.

The `path` should be the full path to the content. For example if I had `www.tangia.co` as my domain, and my path was `/post/optimizing-your-tweets-to-maximize-the-algorithm` then content would be expected to be at `www.tangia.co/post/optimizing-your-tweets-to-maximize-the-algorithm`.

Generated FAQs also have a 12 hour expiry. When expired, GPTFAQ behaves like a `stale-while-revalidate` where it will immediately serve the stale data, and in the background launch another generation job.

To increase the expiry period you can put a CDN in front of the API for the read route, caching if it's a `200` response (no content is `204`, a quick way to do this is to use Vercel functions with caching returns), or you can change the expiry period (see env var).

### On-demand generation

This will return a 204 for this first time the FAQ data is requested, and kick of a generation job. It takes up to a minute, and future requests will be served the FAQ data.

### Poke generation

You can "poke" the path to the specific page. This is useful for hooking up to a webhook when you publish a blog post or article.

You can optionally provide the content during the poke, which supports `html`, `markdown`, and `text` content types. `html` and `markdown` will preserve links for the FAQ answers where relevant.

This requires a `poke_token` that you must set to use. This is the only place auth is required.

## Setup

First you need to run the `src/db/schema.sql` on postgres or cockroachdb.

### Environment Variables

`DSN` for connecting to a DB.

`OPENAI_TOKEN` for calling GPT-4. Must have `gpt-4` model access.

`INNGEST_SIGNING_KEY` for inngest, which is used for managing the task.

`EXPIRE_HOURS` How many hours past generation will records expire. `0` means never expire.

### HTML/JS serving

You must put the snippet found at `snippet.html` in your site somewhere, with the `script.js` being served as well.

Search engines will wait for this to load, but keep in mind that the generation has to be ready for them to see it, and it may be a long time before they revisit. Poking is highly encouraged.
