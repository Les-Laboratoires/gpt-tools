import guilds, { GuildTable } from "../tables/guilds.js"

export async function ensureGuild(id: string): Promise<GuildTable> {
  const guild = await guilds.query.where("id", id).first()

  if (guild) {
    return guild
  }

  return guilds.query.insert({ id })
}

export async function addMessage(id: string): Promise<void> {
  await ensureGuild(id)
  await guilds.query.where("id", id).increment("messageCount", 1)
}

export async function removeData(
  id: string,
  key: keyof GuildTable
): Promise<void> {
  await guilds.query.where("id", id).update({ [key]: null })
}
