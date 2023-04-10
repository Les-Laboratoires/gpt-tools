import * as openai from "openai"
import * as discord from "discord.js"
import { client } from "../app/openai.js"
import { Command } from "../app/commands.js"

new Command({
  name: "default",
  inGuild: true,
  run: async (message, parts, called) => {
    if (!called) {
      if (Math.random() > 0.05) return
    }

    await message.channel.sendTyping()

    const lastMessages = await message.channel.messages.fetch({ limit: 20 })
    const usedMessages = lastMessages.filter(
      (msg) =>
        msg.system ||
        (msg.author.id !== message.client.user.id && msg.author.bot)
    )

    const result = await client.createChatCompletion({
      model: process.env.MODEL ?? "gpt-3.5-turbo",
      messages: [
        {
          role: openai.ChatCompletionRequestMessageRoleEnum.System,
          name: message.client.user.username,
          content:
            "Je suis le bot de gestion de votre serveur Discord. Une communauté de développeurs JavaScript francophone. Lorsqu'on me mentionne, mon nom est: <@555419470894596096>.",
        },
        {
          role: openai.ChatCompletionRequestMessageRoleEnum.User,
          name: message.author.username,
          content: message.content,
        },
        ...usedMessages.map((msg) => {
          const isMe = msg.author.id === message.client.user.id
          return {
            role: isMe
              ? openai.ChatCompletionRequestMessageRoleEnum.System
              : openai.ChatCompletionRequestMessageRoleEnum.User,
            name: msg.author.username,
            content: msg.content,
          }
        }),
      ],
    })

    await message.reply(
      result.data.choices[0].message ?? "Désolé, je n'ai pas compris."
    )
  },
})
