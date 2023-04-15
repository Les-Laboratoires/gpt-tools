import chalk from "chalk"
import { Logger } from "@ghom/logger"
import { Listener } from "../app/listeners.js"

const logger = new Logger({
  section: "Discord",
})

new Listener({
  event: "ready",
  once: true,
  async run(client) {
    logger.log(`Logged in as ${chalk.blueBright(client.user.tag)}!`)
  },
})
