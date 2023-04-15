import * as discord from "discord.js"

import { GuildTable } from "../tables/guilds"

export async function updateTracker(
  trackerCategory: discord.CategoryChannel,
  guildConfig: GuildTable
) {
  // Remove children
  await Promise.all(
    trackerCategory.children.cache.map((channel) => channel.delete())
  )

  // Options
  const options: Omit<
    discord.GuildChannelCreateOptions & {
      type: discord.ChannelType.GuildVoice
    },
    "name"
  > = {
    type: discord.ChannelType.GuildVoice,
    parent: trackerCategory,
    permissionOverwrites: [
      {
        id: trackerCategory.guild.roles.everyone,
        allow: [discord.PermissionsBitField.Flags.ViewChannel],
        deny: [discord.PermissionsBitField.Flags.Connect],
      },
    ],
  }

  // Members
  const members = await trackerCategory.guild.members.fetch({
    withPresences: true,
  })

  // Member count
  await trackerCategory.guild.channels.create({
    name: guildConfig.memberTrackerPattern.replace(
      "$count",
      trackerCategory.guild.memberCount.toString()
    ),
    ...options,
  })

  // Online count
  await trackerCategory.guild.channels.create({
    name: guildConfig.onlineTrackerPattern.replace(
      "$count",
      members
        .filter((member) => member?.presence?.status !== "offline")
        .size.toString()
    ),
    ...options,
  })

  // Message count
  await trackerCategory.guild.channels.create({
    name: guildConfig.messageTrackerPattern.replace(
      "$count",
      guildConfig.messageCount.toString()
    ),
    ...options,
  })
}
