import * as discord from "discord.js"
import * as guilds from "../utils/guilds.js"
import * as tracker from "../utils/tracker.js"
import { Listener } from "../app/listeners.js"

new Listener({
  event: "guildMemberAdd",
  run: async (member) => {
    const guildConfig = await guilds.ensure(member.guild.id)

    // TRACKER
    if (guildConfig.trackerCategory) {
      const trackerCategory = await member.guild.channels.fetch(
        guildConfig.trackerCategory
      )

      if (trackerCategory) {
        if (trackerCategory.type === discord.ChannelType.GuildCategory) {
          await tracker.updateTracker(trackerCategory, guildConfig)
        }
      }
    }

    // WELCOME
    if (member.user.bot) {
      if (guildConfig.botArriveMessage) {
      }
    } else if (guildConfig.userArriveMessage) {
    }
  },
})
