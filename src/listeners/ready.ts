import { client } from "../app/client.js"

client.on("ready", (client) => {
  console.log(`Logged in as ${client.user.tag}!`)
})
