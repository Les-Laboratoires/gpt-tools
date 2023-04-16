import * as discord from "discord.js"

import { GuildTable, default as guildTable } from "../tables/guilds.js"
import { client } from "../app/client.js"

export interface TrackerValues {
  memberCount: number
  onlineCount: number
  messageCount: number
}

export async function fetchTrackerValues(
  trackerCategory: discord.CategoryChannel,
  guildConfig: GuildTable,
  members: discord.Collection<string, discord.GuildMember>
): Promise<TrackerValues> {
  return {
    memberCount: trackerCategory.guild.memberCount,
    onlineCount: members.filter(
      (member) => member?.presence?.status !== "offline"
    ).size,
    messageCount: guildConfig.messageCount,
  }
}

export async function updateTrackerCategory(
  trackerCategory: discord.CategoryChannel,
  guildConfig: GuildTable,
  values: TrackerValues
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

  // Member count
  await trackerCategory.guild.channels.create({
    name: guildConfig.memberTrackerPattern.replace(
      "$count",
      values.memberCount.toString()
    ),
    ...options,
  })

  // Online count
  await trackerCategory.guild.channels.create({
    name: guildConfig.onlineTrackerPattern.replace(
      "$count",
      values.onlineCount.toString()
    ),
    ...options,
  })

  // Message count
  await trackerCategory.guild.channels.create({
    name: guildConfig.messageTrackerPattern.replace(
      "$count",
      values.messageCount.toString()
    ),
    ...options,
  })
}

export async function getTrackedGuilds(): Promise<
  (GuildTable & { trackerCategory: string })[]
> {
  // @ts-ignore
  return guildTable.query.whereNotNull("trackerCategory")
}

export async function updateAllTrackers() {
  const guildConfigs = await getTrackedGuilds()

  for (const guildConfig of guildConfigs) {
    const guild = client.guilds.cache.get(guildConfig.id)

    if (!guild) {
      await guildTable.query.where("id", guildConfig.id).delete()
      continue
    }

    const category = await client.channels.fetch(guildConfig.trackerCategory)

    if (!category || category.type !== discord.ChannelType.GuildCategory) {
      await guildTable.query
        .where("id", guildConfig.id)
        .update({ trackerCategory: null })
      continue
    }

    const members = await guild.members.fetch({
      withPresences: true,
    })

    const values = await fetchTrackerValues(category, guildConfig, members)

    if (
      values.memberCount === guildConfig.lastMemberCount &&
      values.onlineCount === guildConfig.lastOnlineCount &&
      values.messageCount === guildConfig.lastMessageCount
    ) {
      continue
    }

    await updateTrackerCategory(category, guildConfig, values)
  }
}
