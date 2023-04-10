import { client } from "../app/client.js"

client.once("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})
