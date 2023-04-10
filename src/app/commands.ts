import path from "path"
import * as discord from "discord.js"
import * as handler from "@ghom/handler"

const commandHandler = new handler.Handler("dist/commands")

commandHandler.on(
  "load",
  (file) => import("file://" + path.join(process.cwd(), file))
)

export const commands = new discord.Collection<string, Command>()

export class Command {
  constructor(
    public name: string,
    public aliases: string[],
    public run: (message: discord.Message) => void
  ) {
    commands.set(name, this)
  }

  public match(name: string) {
    return this.name === name || this.aliases.includes(name)
  }
}

export default () => commandHandler.load()
