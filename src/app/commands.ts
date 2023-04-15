import path from "path"
import chalk from "chalk"
import * as discord from "discord.js"
import { Handler } from "@ghom/handler"
import { Logger } from "@ghom/logger"

const commandHandler = new Handler("dist/commands")
const commandLogger = new Logger({
  section: "Commands",
})

commandHandler.on("load", (file) => {
  commandLogger.log(
    `loaded command ${chalk.blueBright(path.basename(file, ".js"))}`
  )
  return import("file://" + path.join(process.cwd(), file))
})

export const commands = new discord.Collection<string, Command<any>>()

export interface CommandOptions<InGuild extends boolean> {
  name: string
  inGuild: InGuild
  aliases?: string[]
  run: (
    message: discord.Message<InGuild>,
    parts: string[],
    called: boolean
  ) => void
}

export class Command<InGuild extends boolean> {
  constructor(public options: CommandOptions<InGuild>) {
    commands.set(options.name, this)
  }

  public match(name: string) {
    return this.options.name === name || !!this.options.aliases?.includes(name)
  }
}

export default () => commandHandler.load()
