import path from "path"
import * as discord from "discord.js"
import * as handler from "@ghom/handler"

const commandHandler = new handler.Handler("dist/commands")

commandHandler.on(
  "load",
  (file) => import("file://" + path.join(process.cwd(), file))
)

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
