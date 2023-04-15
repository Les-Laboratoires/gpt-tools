import guilds, { GuildTable } from "../tables/guilds.js"

export async function ensure(id: string): Promise<GuildTable> {
  const guild = await guilds.query.where("id", id).first()

  if (guild) {
    return guild
  }

  return guilds.query.insert({ id })
}

export async function addMessage(id: string): Promise<void> {
  await ensure(id)
  await guilds.query.where("id", id).increment("messageCount", 1)
}
