import * as openai from "openai"

export const gpt = new openai.OpenAIApi(
  new openai.Configuration({
    apiKey: process.env.API_KEY,
  })
)
