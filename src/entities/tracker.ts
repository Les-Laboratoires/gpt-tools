import cron from "node-cron"
import discord from "discord.js"
import { Entity } from "../app/entities.js"
import { client } from "../app/client.js"
import guildTable, { GuildTable } from "../tables/guilds.js"

export interface TrackerValues {
  memberCount: number
  onlineCount: number
  messageCount: number
}

class Tracker extends Entity {
  async init() {
    // Update all trackers every 10 minutes if a change has been made
    // cron.schedule("*/10 * * * *", this.updateAllTrackers.bind(this))
  }

  async updateAllTrackers() {
    // const guildConfigs = await this.getTrackedGuilds()
    //
    // for (const guildConfig of guildConfigs) {
    //   const guild = client.guilds.cache.get(guildConfig.id)
    //
    //   if (!guild) {
    //     await guildTable.query.where("id", guildConfig.id).delete()
    //     continue
    //   }
    //
    //   const category = await client.channels.fetch(guildConfig.trackerCategory)
    //
    //   if (!category || category.type !== discord.ChannelType.GuildCategory) {
    //     await guildTable.query
    //       .where("id", guildConfig.id)
    //       .update({ trackerCategory: null })
    //     continue
    //   }
    //
    //   const members = await guild.members.fetch({
    //     withPresences: true,
    //   })
    //
    //   const values = await this.resolveTrackerValues(
    //     category,
    //     guildConfig,
    //     members
    //   )
    //
    //   if (
    //     values.memberCount === guildConfig.lastMemberCount &&
    //     values.onlineCount === guildConfig.lastOnlineCount &&
    //     values.messageCount === guildConfig.lastMessageCount
    //   ) {
    //     continue
    //   }
    //
    //   await this.updateTrackerCategory(category, guildConfig, values)
    // }
  }

  getTrackedGuilds(): Promise<(GuildTable & { trackerCategory: string })[]> {
    // @ts-ignore
    return guildTable.query.whereNotNull("trackerCategory")
  }

  async updateTrackerCategory(
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

  resolveTrackerValues(
    trackerCategory: discord.CategoryChannel,
    guildConfig: GuildTable,
    members: discord.Collection<string, discord.GuildMember>
  ): TrackerValues {
    return {
      memberCount: trackerCategory.guild.memberCount,
      onlineCount: members.filter(
        (member) => member?.presence?.status !== "offline"
      ).size,
      messageCount: guildConfig.messageCount,
    }
  }
}

export default new Tracker()
