import path from "path"
import chalk from "chalk"
import * as discord from "discord.js"
import * as logger from "@ghom/logger"
import * as handler from "@ghom/handler"

import { client } from "./client.js"

const listenerHandler = new handler.Handler("dist/listeners")
const listenerLogger = new logger.Logger({
  section: "Listeners",
})

listenerHandler.on("load", (file) => {
  listenerLogger.log(
    `loaded listener ${chalk.blueBright(path.basename(file, ".js"))}`
  )
  return import("file://" + path.join(process.cwd(), file))
})

export interface ListenerOptions<EventName extends keyof discord.ClientEvents> {
  event: EventName
  once?: boolean
  run: (...args: discord.ClientEvents[EventName]) => Promise<void>
}

export class Listener<EventName extends keyof discord.ClientEvents> {
  constructor(public readonly options: ListenerOptions<EventName>) {
    client[options.once ? "once" : "on"]<EventName>(
      options.event,
      async (...args) => {
        try {
          await options.run(...args)
        } catch (error) {
          listenerLogger.error(error as Error)
        }
      }
    )
  }
}

export default () => listenerHandler.load()
