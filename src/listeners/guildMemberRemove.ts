import * as discord from "discord.js"
import * as guilds from "../utils/guilds.js"
import * as arriveLeave from "../utils/arriveLeave.js"
import { Listener } from "../app/listeners.js"

new Listener({
  event: "guildMemberRemove",
  run: async (member) => {
    const guildConfig = await guilds.ensureGuild(member.guild.id)

    if (!guildConfig.leaveMessageChannel) return

    const channel = member.guild.channels.cache.get(
      guildConfig.leaveMessageChannel
    )

    if (channel?.type !== discord.ChannelType.GuildText) {
      await guilds.removeData(member.guild.id, "leaveMessageChannel")
      return
    }

    // BYE
    if (member.user.bot) {
      if (guildConfig.botLeaveMessage) {
        await channel.send(
          arriveLeave.buildMessage(guildConfig.botLeaveMessage, member)
        )
      }
    } else if (guildConfig.userLeaveMessage) {
      await channel.send(
        arriveLeave.buildMessage(guildConfig.userLeaveMessage, member)
      )
    }
  },
})
