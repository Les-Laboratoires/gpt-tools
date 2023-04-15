import * as discord from "discord.js"
import * as tracker from "../utils/tracker.js"
import { client } from "../app/client.js"
import guilds from "../tables/guilds.js"

client.on("guildMemberAdd", async (member) => {
  const guildConfig = await guilds.query.where("id", member.guild.id).first()

  if (guildConfig) {
    // TRACKER
    if (guildConfig.trackerCategory) {
      const trackerCategory = await member.guild.channels.fetch(
        guildConfig.trackerCategory
      )

      if (trackerCategory) {
        if (trackerCategory.type === discord.ChannelType.GuildCategory) {
          await tracker.updateTracker(trackerCategory)
        }
      }
    }

    // WELCOME
    if (member.user.bot) {
      if (guildConfig.botArriveMessage) {
      }
    } else if (guildConfig.userArriveMessage) {
    }
  }
})
