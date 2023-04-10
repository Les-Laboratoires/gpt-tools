import { client } from "../app/client.js"
import { commands } from "../app/commands.js"

client.on("messageCreate", async (message) => {
  if (message.author.bot) return

  const app = await message.client.application.fetch()

  if (message.author.id !== app.owner?.id) return

  const commandName = message.content.split(" ")[0].slice(1)

  let command = commands.find((command) => command.match(commandName))

  if (!command) {
    if (
      commands.has("default") &&
      message.mentions.users.has(message.client.user.id)
    ) {
      command = commands.get("default")!
    } else {
      return
    }
  }

  try {
    await command.run(message)
  } catch (error) {
    console.error(error)

    await message.reply(
      "There was an error trying to execute that command! Please read the server console for more information."
    )
  }
})
