import { client } from "../app/openai.js"
import { Command } from "../app/commands.js"

new Command("default", [], async (message) => {
  await message.channel.sendTyping()

  const result = await client.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "system",
        //name: "Lab Tool",
        content:
          "Je suis le bot de gestion de votre serveur Discord. Une communauté de développeurs JavaScript francophone. Lorsqu'on me mentionne, mon nom est: <@555419470894596096>.",
      },
      {
        role: "user",
        //name: message.author.username,
        content: message.content,
      },
    ],
  })

  await message.reply(
    result.data.choices[0].message ?? "Désolé, je n'ai pas compris."
  )
})
