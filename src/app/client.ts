import * as discord from "discord.js"

export const client = new discord.Client({
  intents: [
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.MessageContent,
  ],
})

export default () => client.login(process.env.BOT_TOKEN)
