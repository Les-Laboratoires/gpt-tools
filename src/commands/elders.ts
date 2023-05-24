import discord from "discord.js"
import dayjs from "dayjs"

import { Command } from "../app/commands"

import guilds from "../tables/guilds"

import { ensureGuild } from "../utils/guilds"

let used = false

new Command({
  name: "elders",
  inGuild: true,
  run: async (message, parts, called) => {
    if (message.author.id !== message.client.application.owner?.id)
      return await message.reply("You are not allowed to use this command.")

    if (parts[0] === "add") {
      parts.shift()
      return await addElder(message, parts, called)
    }

    used = true

    const waiting = await message.reply(`Fetching members...`)

    const config = await ensureGuild(message.guild.id)

    const guildRoles = await message.guild.roles.fetch(undefined, {
      force: true,
      cache: true,
    })

    const elderRoles = JSON.parse(config.elderRoles, (key, value) =>
      guildRoles.get(value)
    ) as Record<number, discord.Role>

    message.guild.members.cache.clear()
    message.guild.roles.cache.clear()

    const members = (await message.guild.members.fetch())
      .filter((member) => !member.user.bot)
      .map((member) => member)

    await waiting.edit(`Looking for new elders...`)

    const logs: string[] = []

    for (const member of members) {
      const memberRoles: string[] = member.roles.cache
        .filter((role) => !Object.values(elderRoles).includes(role))
        .map((role) => role.id)

      let changed = false,
        maxYear = 0

      for (const [years, role] of Object.entries(elderRoles)) {
        if (
          dayjs().diff(
            member.joinedAt || member.joinedTimestamp,
            "years",
            true
          ) >= Number(years)
        ) {
          memberRoles.push(role.id)
          maxYear = Math.max(maxYear, Number(years))
          changed = true
        }
      }

      if (changed) {
        await member.roles
          .set(memberRoles)
          .then(() => {
            logs.push(`**${member.user.tag}** is **${maxYear}** years old!`)
          })
          .catch((err) =>
            logs.push(`**${member.user.tag}** error: \`${err.message}\``)
          )

        const index = members.indexOf(member)

        await waiting.edit(`Progress: ${index + 1}/${members.length}`)
      }
    }

    message.guild.members.cache.clear()

    if (logs.length === 0) {
      used = false

      return waiting.edit(`Not new elders found.`)
    }

    await waiting.delete().catch()

    await waiting.edit(
      `Resolved ${logs.filter((log) => !log.includes("error:")).length} elders.`
    )

    used = false
  },
})

async function addElder(
  message: discord.Message<true>,
  parts: string[],
  called: boolean
): Promise<unknown> {
  if (!parts[0]) return await message.reply("You must provide a role ID.")
  if (!parts[1])
    return await message.reply("You must provide a period in years.")

  const [roleId, years] = parts

  const guildRoles = await message.guild.roles.fetch(undefined, {
    force: true,
    cache: true,
  })

  if (isNaN(Number(years)))
    return await message.reply("The period must be a number.")
  if (!guildRoles.has(roleId))
    return await message.reply("The role does not exist.")

  const config = await ensureGuild(message.guild.id)

  if (config.elderRoles.includes(roleId))
    return await message.reply("The role is already an elder role.")

  const elderRoles = JSON.parse(config.elderRoles) as Record<number, string>

  elderRoles[Number(years)] = roleId

  config.elderRoles = JSON.stringify(elderRoles)

  await guilds.query.insert(config).onConflict("id").merge()

  return await message.reply({
    allowedMentions: {
      roles: [],
    },
    content: `The role <@&${roleId}> has been added as an elder role for ${years} years.`,
  })
}
